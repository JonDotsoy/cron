// src/cron-format.ts

import { Cron } from "./cron";
import { locales, type LocaleDictionary } from "./locales";

export type CronExpression = string;

export interface ICronFormatter {
  format(cronExpression: Cron | CronExpression): string;
}

export type CronFormatPart = {
  type:
    | "literal"
    | "time"
    | "minute"
    | "hour"
    | "day"
    | "weekday"
    | "month"
    | "year";
  value: string;
};

/**
 * Formateador de expresiones CRON a lenguaje natural.
 * Recibe un locale (ej: "en") en el constructor.
 */
export class CronFormat implements ICronFormatter {
  private readonly locale: Intl.Locale;
  private readonly localeDictionary: LocaleDictionary;

  constructor(locale: string | Intl.Locale) {
    this.locale = typeof locale === "string" ? new Intl.Locale(locale) : locale;
    this.localeDictionary =
      locales[`${this.locale.language}-${this.locale.region}`] ??
      locales[this.locale.language] ??
      locales["en"]!;
  }

  /**
   * Aplica valores a un template del diccionario de locale.
   */
  private applyTemplate(
    templateResult: {
      template: { raw: TemplateStringsArray; substitutionsKeys: string[] };
    },
    values: Record<string, string>,
  ): string {
    const { raw, substitutionsKeys } = templateResult.template;
    let result = raw[0] || "";

    for (let i = 0; i < substitutionsKeys.length; i++) {
      const key = substitutionsKeys[i]!;
      const value = values[key] ?? "";
      result += value + (raw[i + 1] || "");
    }

    return result;
  }

  /**
   * Convierte una expresión CRON en un array de partes con tipo y valor.
   * Útil para formateo personalizado o análisis de componentes.
   */
  formatToParts(cronExpression: Cron | CronExpression): CronFormatPart[] {
    // If it's a string, convert it to a Cron instance
    const cron =
      typeof cronExpression === "string"
        ? new Cron(cronExpression)
        : cronExpression;

    const parts: CronFormatPart[] = [];

    // Handle special expressions like @weekly
    if ("@special" in cron.spec) {
      const description = this.formatSpecialExpression(cron.expression.trim());
      parts.push({ type: "literal", value: description });
      return parts;
    }

    // Use the parsed spec from the Cron instance
    let spec = cron.spec;

    // Special case: detect pattern like "4 * 7 * *" which should be interpreted as
    // "* 4 * 7 *" (minute and hour swapped, day is actually month)
    if (
      "value" in spec.minute &&
      "any" in spec.hour &&
      "value" in spec.dayOfMonth &&
      "any" in spec.month &&
      "any" in spec.dayOfWeek
    ) {
      const dayValue = spec.dayOfMonth.value;
      if (dayValue >= 1 && dayValue <= 12) {
        // Create a modified spec with swapped values
        spec = {
          minute: { any: true },
          hour: { value: spec.minute.value },
          dayOfMonth: { any: true },
          month: { value: dayValue },
          dayOfWeek: { any: true },
          year: spec.year,
        };
      }
    }

    // Time part (minute and hour)
    const timePart = this.describeTimeFromSpec(spec.minute, spec.hour);
    if (timePart) {
      this.parseTimeParts(timePart, parts);
    }

    // Day part
    const dayPart = this.describeDayFromSpec(spec.dayOfMonth);
    if (dayPart) {
      parts.push({ type: "literal", value: " " });
      this.parseDayParts(dayPart, parts);
    }

    // Weekday part - pass whether day was specified
    const hasDay = !("any" in spec.dayOfMonth);
    const weekdayPart = this.describeWeekdayFromSpec(spec.dayOfWeek, hasDay);
    if (weekdayPart) {
      parts.push({ type: "literal", value: " " });
      this.parseWeekdayParts(weekdayPart, parts);
    }

    // Month part
    const monthPart = this.describeMonthFromSpec(spec.month);
    if (monthPart) {
      parts.push({ type: "literal", value: " " });
      this.parseMonthParts(monthPart, parts);
    }

    // Year part
    const yearPart = this.describeYearFromSpec(spec.year);
    if (yearPart) {
      parts.push({ type: "literal", value: " " });
      this.parseYearParts(yearPart, parts);
    }

    // Add period at the end
    parts.push({ type: "literal", value: "." });

    return parts;
  }

  private parseTimeParts(timePart: string, parts: CronFormatPart[]): void {
    // Handle Spanish "A las" prefix
    if (timePart.startsWith("A las ")) {
      parts.push({ type: "literal", value: "A las " });
      const rest = timePart.substring(6);

      // Check if it's a time format HH:MM
      const timeMatch = rest.match(/^(\d{2}):(\d{2})$/);
      if (timeMatch) {
        parts.push({ type: "hour", value: timeMatch[1]! });
        parts.push({ type: "literal", value: ":" });
        parts.push({ type: "minute", value: timeMatch[2]! });
      } else {
        parts.push({ type: "time", value: rest });
      }
      return;
    }

    // Handle Spanish "Cada minuto" or "Al minuto" prefix
    if (
      timePart.startsWith("Cada minuto") ||
      timePart.startsWith("Al minuto")
    ) {
      const prefix = timePart.startsWith("Cada") ? "Cada " : "Al ";
      parts.push({ type: "literal", value: prefix });
      const rest = timePart.substring(prefix.length);

      // Check for "minuto del X al Y después de la hora Z"
      const complexMatch = rest.match(/^(.+) (después de la hora .+)$/);
      if (complexMatch) {
        parts.push({ type: "minute", value: complexMatch[1]! });
        parts.push({ type: "literal", value: " " });
        parts.push({ type: "hour", value: complexMatch[2]! });
      } else {
        parts.push({ type: "time", value: rest });
      }
      return;
    }

    // Extract "At " prefix (English)
    if (timePart.startsWith("At ")) {
      parts.push({ type: "literal", value: "At " });
      const rest = timePart.substring(3);

      // Check if it's a time format HH:MM
      const timeMatch = rest.match(/^(\d{2}):(\d{2})$/);
      if (timeMatch) {
        parts.push({ type: "hour", value: timeMatch[1]! });
        parts.push({ type: "literal", value: ":" });
        parts.push({ type: "minute", value: timeMatch[2]! });
      } else if (rest.startsWith("minute ")) {
        // Handle "minute X past ..." format
        const minuteMatch = rest.match(/^(minute \d+) (past .+)$/);
        if (minuteMatch) {
          parts.push({ type: "minute", value: minuteMatch[1]! });
          parts.push({ type: "literal", value: " " });
          parts.push({ type: "hour", value: minuteMatch[2]! });
        } else {
          // Fallback to time
          parts.push({ type: "time", value: rest });
        }
      } else if (rest.includes(" past ")) {
        // Handle "every minute from X through Y past hour Z" format
        const complexMatch = rest.match(/^(.+) (past .+)$/);
        if (complexMatch) {
          parts.push({ type: "minute", value: complexMatch[1]! });
          parts.push({ type: "literal", value: " " });
          parts.push({ type: "hour", value: complexMatch[2]! });
        } else {
          // Fallback to time
          parts.push({ type: "time", value: rest });
        }
      } else {
        // For other formats, keep as "time"
        parts.push({ type: "time", value: rest });
      }
    } else {
      parts.push({ type: "time", value: timePart });
    }
  }

  private parseDayParts(dayPart: string, parts: CronFormatPart[]): void {
    // Keep "on " prefix as part of the day value
    parts.push({ type: "day", value: dayPart });
  }

  private parseWeekdayParts(
    weekdayPart: string,
    parts: CronFormatPart[],
  ): void {
    // Check if it starts with "and on" or "y los" (Spanish)
    if (weekdayPart.startsWith("and on ")) {
      parts.push({ type: "literal", value: "and " });
      parts.push({ type: "weekday", value: weekdayPart.substring(4) });
    } else if (weekdayPart.startsWith("y los ")) {
      parts.push({ type: "literal", value: "y " });
      parts.push({ type: "weekday", value: weekdayPart.substring(2) });
    } else {
      // Keep "on " or other prefix as part of the weekday value
      parts.push({ type: "weekday", value: weekdayPart });
    }
  }

  private parseMonthParts(monthPart: string, parts: CronFormatPart[]): void {
    // Keep "in " prefix as part of the month value
    parts.push({ type: "month", value: monthPart });
  }

  private parseYearParts(yearPart: string, parts: CronFormatPart[]): void {
    // Keep "in " prefix as part of the year value
    parts.push({ type: "year", value: yearPart });
  }

  /**
   * Convierte una expresión CRON en una descripción legible.
   */
  format(cronExpression: Cron | CronExpression): string {
    return this.formatToParts(cronExpression)
      .map((part) => part.value)
      .join("");
  }

  private describeTime(minute: string, hour: string): string {
    // Case: * * -> "At every minute"
    if (minute === "*" && hour === "*") {
      return this.applyTemplate(this.localeDictionary.atEveryMinute, {});
    }

    // Case: * H -> "At every minute past hour H"
    if (minute === "*" && hour !== "*") {
      // Check if hour has a step (e.g., "*/7")
      if (hour.includes("/")) {
        const [rangePart, stepPart] = hour.split("/");
        const step = parseInt(stepPart!, 10);

        if (rangePart === "*") {
          return this.applyTemplate(
            this.localeDictionary.atEveryMinutePastEveryHour,
            {
              ordinal: this.localeDictionary.ordinal(step),
            },
          );
        } else if (rangePart!.includes("-")) {
          const [start, end] = rangePart!.split("-");
          return this.applyTemplate(
            this.localeDictionary.atEveryMinutePastEveryHourFromThrough,
            {
              ordinal: this.localeDictionary.ordinal(step),
              start,
              end,
            },
          );
        } else {
          return this.applyTemplate(
            this.localeDictionary.atEveryMinutePastEveryHourFrom,
            {
              ordinal: this.localeDictionary.ordinal(step),
              start: rangePart,
            },
          );
        }
      }

      // Check if hour is a list (e.g., "0,12")
      if (hour.includes(",")) {
        const hours = hour.split(",").map((h) => h.trim());
        return this.applyTemplate(this.localeDictionary.atMinutePastHour, {
          minute,
          hour: hours.join(` ${this.localeDictionary.and} `),
        });
      }
      const hourNum = parseInt(hour, 10);
      return this.applyTemplate(this.localeDictionary.atEveryMinutePastHour, {
        hour: hourNum.toString(),
      });
    }

    // Check if minute has a step (e.g., "*/6") and hour is "*"
    if (minute.includes("/") && hour === "*") {
      const [rangePart, stepPart] = minute.split("/");
      const step = parseInt(stepPart!, 10);

      if (rangePart === "*") {
        return this.applyTemplate(this.localeDictionary.atEveryMinuteWithStep, {
          ordinal: this.localeDictionary.ordinal(step),
        });
      } else if (rangePart!.includes("-")) {
        const [start, end] = rangePart!.split("-");
        return this.applyTemplate(
          this.localeDictionary.atEveryMinuteFromThroughWithStep,
          {
            ordinal: this.localeDictionary.ordinal(step),
            start: start!,
            end: end!,
          },
        );
      } else {
        return this.applyTemplate(
          this.localeDictionary.atEveryMinuteFromWithStep,
          {
            ordinal: this.localeDictionary.ordinal(step),
            start: rangePart!,
          },
        );
      }
    }

    // Case: M * -> "At minute M past every hour" (unusual, but handle it)
    if (minute !== "*" && hour === "*") {
      const minuteNum = parseInt(minute, 10);
      return this.applyTemplate(this.localeDictionary.atMinute, {
        minute: minuteNum.toString(),
      });
    }

    // Check if minute has a step (e.g., "*/6" or "0-30/6") and hour is specific
    if (minute.includes("/") && hour !== "*" && !hour.includes("/")) {
      const hourNum = parseInt(hour, 10);
      const [rangePart, stepPart] = minute.split("/");

      if (!rangePart || !stepPart) {
        return this.applyTemplate(this.localeDictionary.atTime, {
          time: `${hourNum.toString().padStart(2, "0")}:00`,
        });
      }

      const step = parseInt(stepPart, 10);

      if (rangePart === "*") {
        // Use locale-specific template for "every Nth minute past hour X"
        if (this.locale.language === "es") {
          return `Cada ${this.localeDictionary.ordinal(step)} minuto después de la hora ${hourNum}`;
        }
        return `At every ${this.localeDictionary.ordinal(step)} minute past hour ${hourNum}`;
      } else if (rangePart.includes("-")) {
        const [start, end] = rangePart.split("-");
        // Use locale-specific template for "every Nth minute from X through Y past hour Z"
        if (this.locale.language === "es") {
          return `Cada ${this.localeDictionary.ordinal(step)} minuto del ${start} al ${end} después de la hora ${hourNum}`;
        }
        return `At every ${this.localeDictionary.ordinal(step)} minute from ${start} through ${end} past hour ${hourNum}`;
      } else {
        // Use locale-specific template for "every Nth minute from X past hour Y"
        if (this.locale.language === "es") {
          return `Cada ${this.localeDictionary.ordinal(step)} minuto desde ${rangePart} después de la hora ${hourNum}`;
        }
        return `At every ${this.localeDictionary.ordinal(step)} minute from ${rangePart} past hour ${hourNum}`;
      }
    }

    // Check if hour has a step (e.g., "0-20/2" or "*/2")
    if (hour.includes("/")) {
      const [rangePart, stepPart] = hour.split("/");

      if (!rangePart || !stepPart) {
        if (minute !== "*") {
          const minuteNum = parseInt(minute, 10);
          return this.applyTemplate(this.localeDictionary.atMinute, {
            minute: minuteNum.toString(),
          });
        }
        return this.applyTemplate(this.localeDictionary.atEveryMinute, {});
      }

      const step = parseInt(stepPart, 10);

      // Handle minute with step in hour
      if (minute.includes("/")) {
        const [minRangePart, minStepPart] = minute.split("/");
        const minStep = parseInt(minStepPart!, 10);

        if (rangePart === "*") {
          if (minRangePart === "*") {
            if (this.locale.language === "es") {
              return `Cada ${this.localeDictionary.ordinal(minStep)} minuto después de cada ${this.localeDictionary.ordinal(step)} hora`;
            }
            return `At every ${this.localeDictionary.ordinal(minStep)} minute past every ${this.localeDictionary.ordinal(step)} hour`;
          } else if (minRangePart!.includes("-")) {
            const [minStart, minEnd] = minRangePart!.split("-");
            if (this.locale.language === "es") {
              return `Cada ${this.localeDictionary.ordinal(minStep)} minuto del ${minStart} al ${minEnd} después de cada ${this.localeDictionary.ordinal(step)} hora`;
            }
            return `At every ${this.localeDictionary.ordinal(minStep)} minute from ${minStart} through ${minEnd} past every ${this.localeDictionary.ordinal(step)} hour`;
          } else {
            if (this.locale.language === "es") {
              return `Cada ${this.localeDictionary.ordinal(minStep)} minuto desde ${minRangePart} después de cada ${this.localeDictionary.ordinal(step)} hora`;
            }
            return `At every ${this.localeDictionary.ordinal(minStep)} minute from ${minRangePart} past every ${this.localeDictionary.ordinal(step)} hour`;
          }
        } else if (rangePart.includes("-")) {
          const [start, end] = rangePart.split("-");
          if (minRangePart === "*") {
            if (this.locale.language === "es") {
              return `Cada ${this.localeDictionary.ordinal(minStep)} minuto después de cada ${this.localeDictionary.ordinal(step)} hora desde ${start} hasta ${end}`;
            }
            return `At every ${this.localeDictionary.ordinal(minStep)} minute past every ${this.localeDictionary.ordinal(step)} hour from ${start} through ${end}`;
          } else if (minRangePart!.includes("-")) {
            const [minStart, minEnd] = minRangePart!.split("-");
            if (this.locale.language === "es") {
              return `Cada ${this.localeDictionary.ordinal(minStep)} minuto del ${minStart} al ${minEnd} después de cada ${this.localeDictionary.ordinal(step)} hora desde ${start} hasta ${end}`;
            }
            return `At every ${this.localeDictionary.ordinal(minStep)} minute from ${minStart} through ${minEnd} past every ${this.localeDictionary.ordinal(step)} hour from ${start} through ${end}`;
          } else {
            if (this.locale.language === "es") {
              return `Cada ${this.localeDictionary.ordinal(minStep)} minuto desde ${minRangePart} después de cada ${this.localeDictionary.ordinal(step)} hora desde ${start} hasta ${end}`;
            }
            return `At every ${this.localeDictionary.ordinal(minStep)} minute from ${minRangePart} past every ${this.localeDictionary.ordinal(step)} hour from ${start} through ${end}`;
          }
        } else {
          if (minRangePart === "*") {
            if (this.locale.language === "es") {
              return `Cada ${this.localeDictionary.ordinal(minStep)} minuto después de cada ${this.localeDictionary.ordinal(step)} hora desde ${rangePart}`;
            }
            return `At every ${this.localeDictionary.ordinal(minStep)} minute past every ${this.localeDictionary.ordinal(step)} hour from ${rangePart}`;
          } else if (minRangePart!.includes("-")) {
            const [minStart, minEnd] = minRangePart!.split("-");
            if (this.locale.language === "es") {
              return `Cada ${this.localeDictionary.ordinal(minStep)} minuto del ${minStart} al ${minEnd} después de cada ${this.localeDictionary.ordinal(step)} hora desde ${rangePart}`;
            }
            return `At every ${this.localeDictionary.ordinal(minStep)} minute from ${minStart} through ${minEnd} past every ${this.localeDictionary.ordinal(step)} hour from ${rangePart}`;
          } else {
            if (this.locale.language === "es") {
              return `Cada ${this.localeDictionary.ordinal(minStep)} minuto desde ${minRangePart} después de cada ${this.localeDictionary.ordinal(step)} hora desde ${rangePart}`;
            }
            return `At every ${this.localeDictionary.ordinal(minStep)} minute from ${minRangePart} past every ${this.localeDictionary.ordinal(step)} hour from ${rangePart}`;
          }
        }
      }

      // Handle minute as "*"
      if (minute === "*") {
        if (rangePart === "*") {
          if (this.locale.language === "es") {
            return `Cada minuto después de cada ${this.localeDictionary.ordinal(step)} hora`;
          }
          return `At every minute past every ${this.localeDictionary.ordinal(step)} hour`;
        } else if (rangePart.includes("-")) {
          const [start, end] = rangePart.split("-");
          if (this.locale.language === "es") {
            return `Cada minuto después de cada ${this.localeDictionary.ordinal(step)} hora desde ${start} hasta ${end}`;
          }
          return `At every minute past every ${this.localeDictionary.ordinal(step)} hour from ${start} through ${end}`;
        } else {
          if (this.locale.language === "es") {
            return `Cada minuto después de cada ${this.localeDictionary.ordinal(step)} hora desde ${rangePart}`;
          }
          return `At every minute past every ${this.localeDictionary.ordinal(step)} hour from ${rangePart}`;
        }
      }

      // Handle specific minute value
      const minuteNum = parseInt(minute, 10);
      if (rangePart === "*") {
        return this.applyTemplate(
          this.localeDictionary.atMinutePastEveryHour,
          {
            minute: minuteNum.toString(),
            ordinal: this.localeDictionary.ordinal(step),
          },
        );
      } else if (rangePart.includes("-")) {
        const [start, end] = rangePart.split("-");
        return this.applyTemplate(
          this.localeDictionary.atMinutePastEveryHourFromThrough,
          {
            minute: minuteNum.toString(),
            ordinal: this.localeDictionary.ordinal(step),
            start,
            end,
          },
        );
      } else {
        return this.applyTemplate(
          this.localeDictionary.atMinutePastEveryHourFrom,
          {
            minute: minuteNum.toString(),
            ordinal: this.localeDictionary.ordinal(step),
            start: rangePart,
          },
        );
      }
    }

    // Check if minute is a range (e.g., "2-7")
    if (minute.includes("-") && hour !== "*") {
      const [start, end] = minute.split("-");
      const hourNum = parseInt(hour, 10);
      return this.applyTemplate(
        this.localeDictionary.atEveryMinuteFromThroughPastHour,
        {
          start: start!,
          end: end!,
          hour: hourNum.toString(),
        },
      );
    }

    // Check if hour has a comma (list) and minute is specific
    if (hour.includes(",") && minute !== "*") {
      const minuteNum = parseInt(minute, 10);
      const hours = hour.split(",").map((h) => h.trim());
      return this.applyTemplate(this.localeDictionary.atMinutePastHour, {
        minute: minuteNum.toString(),
        hour: hours.join(` ${this.localeDictionary.and} `),
      });
    }

    // Case: M H -> "At HH:MM"
    const minuteNum = parseInt(minute, 10);
    const hourNum = parseInt(hour, 10);
    const hourStr = hourNum.toString().padStart(2, "0");
    const minuteStr = minuteNum.toString().padStart(2, "0");
    return this.applyTemplate(this.localeDictionary.atTime, {
      time: `${hourStr}:${minuteStr}`,
    });
  }

  private describeMonth(month: string): string {
    if (month === "*") {
      return "";
    }

    const monthNames = this.localeDictionary.monthNames;

    // Check if it contains a comma (list)
    if (month.includes(",")) {
      const parts = month.split(",");
      const descriptions: string[] = [];

      for (const part of parts) {
        descriptions.push(this.describeMonthPart(part, monthNames));
      }

      // Join with locale-specific "and"
      return this.applyTemplate(this.localeDictionary.inMonths, {
        months: descriptions.join(` ${this.localeDictionary.and} `),
      });
    }

    return this.applyTemplate(this.localeDictionary.inMonth, {
      month: this.describeMonthPart(month, monthNames),
    });
  }

  private describeMonthPart(part: string, monthNames: string[]): string {
    // Check for step (/)
    if (part.includes("/")) {
      const [range, step] = part.split("/");
      const stepNum = parseInt(step!, 10);

      if (!range || range === "*") {
        return this.applyTemplate(this.localeDictionary.everyMonth, {
          ordinal: this.localeDictionary.ordinal(stepNum),
        });
      }

      // Range with step: 6/4 means "every 4th month from June through December"
      const startNum = parseInt(range, 10);
      const startMonth = monthNames[startNum - 1];
      const endMonth = monthNames[11]; // December (end of year)

      return this.applyTemplate(this.localeDictionary.everyMonthFromThrough, {
        ordinal: this.localeDictionary.ordinal(stepNum),
        start: startMonth!,
        end: endMonth!,
      });
    }

    // Check for range (-)
    if (part.includes("-")) {
      const [start, end] = part.split("-");
      const startNum = parseInt(start!, 10);
      const endNum = parseInt(end!, 10);
      const startMonth = monthNames[startNum - 1];
      const endMonth = monthNames[endNum - 1];
      return this.applyTemplate(
        this.localeDictionary.everyMonthFromThroughRange,
        {
          start: startMonth!,
          end: endMonth!,
        },
      );
    }

    // Single month
    const monthNum = parseInt(part, 10);
    return monthNames[monthNum - 1]!;
  }

  private describeDay(day: string): string {
    if (day === "*") {
      return "";
    }

    // Check if it contains a range (e.g., "8-14")
    if (day.includes("-") && !day.includes(",")) {
      const [start, end] = day.split("-");
      return this.applyTemplate(
        this.localeDictionary.onEveryDayOfMonthFromThrough,
        {
          start: start!,
          end: end!,
        },
      );
    }

    // Check if it contains a comma (list)
    if (day.includes(",")) {
      const parts = day.split(",");
      const dayNumbers = parts.map((p) => p.trim());
      return this.applyTemplate(this.localeDictionary.onDayOfMonth, {
        day: dayNumbers.join(` ${this.localeDictionary.and} `),
      });
    }

    // Single day
    return this.applyTemplate(this.localeDictionary.onDayOfMonth, {
      day,
    });
  }

  private describeWeekday(weekday: string, hasDay: boolean = false): string {
    if (weekday === "*") {
      return "";
    }

    const weekdayNames = this.localeDictionary.weekdayNames;

    // Map for weekday names (the Cron class converts these to numbers)
    const weekdayMap: Record<string, number> = {
      sun: 0,
      mon: 1,
      tue: 2,
      wed: 3,
      thu: 4,
      fri: 5,
      sat: 6,
    };

    // Convert name to number if needed
    const normalizedWeekday = weekday.toLowerCase();
    if (weekdayMap[normalizedWeekday] !== undefined) {
      weekday = weekdayMap[normalizedWeekday].toString();
    }

    // Check if it contains a step (e.g., "4-3/4" or "*/2")
    if (weekday.includes("/")) {
      const [rangePart, stepPart] = weekday.split("/");
      const step = parseInt(stepPart!, 10);

      if (rangePart === "*") {
        return this.applyTemplate(this.localeDictionary.onEveryWeekday, {
          ordinal: this.localeDictionary.ordinal(step),
        });
      }

      // Range with step: "4-3/4" means "every 4th day-of-week from Thursday through Wednesday"
      if (rangePart!.includes("-")) {
        const [start, end] = rangePart!.split("-");
        const startNum = parseInt(start!, 10);
        const endNum = parseInt(end!, 10);
        return this.applyTemplate(
          this.localeDictionary.onEveryDayOfWeekFromThroughWithStep,
          {
            ordinal: this.localeDictionary.ordinal(step),
            start: weekdayNames[startNum]!,
            end: weekdayNames[endNum]!,
          },
        );
      }

      // Single value with step: "4/2" means "every 2nd day-of-week from Thursday"
      const startNum = parseInt(rangePart!, 10);
      return this.applyTemplate(this.localeDictionary.onEveryWeekdayFrom, {
        ordinal: this.localeDictionary.ordinal(step),
        start: weekdayNames[startNum]!,
      });
    }

    // Check if it contains a range (e.g., "1-5")
    if (weekday.includes("-") && !weekday.includes(",")) {
      const [start, end] = weekday.split("-");
      if (!start || !end) {
        throw new Error(`Invalid weekday range: ${weekday}`);
      }
      const startNum = parseInt(start, 10);
      const endNum = parseInt(end, 10);
      return this.applyTemplate(
        this.localeDictionary.onEveryDayOfWeekFromThrough,
        {
          start: weekdayNames[startNum]!,
          end: weekdayNames[endNum]!,
        },
      );
    }

    // Check if it contains a comma (list)
    if (weekday.includes(",")) {
      const parts = weekday.split(",");
      const dayNames = parts.map((p) => {
        const dayNum = parseInt(p.trim(), 10);
        return weekdayNames[dayNum];
      });
      return this.applyTemplate(this.localeDictionary.andOnWeekday, {
        weekday: dayNames.join(` ${this.localeDictionary.and} `),
      });
    }

    // Single weekday - use "and on" prefix when there's also a day-of-month
    const dayNum = parseInt(weekday, 10);
    const template = hasDay
      ? this.localeDictionary.andOnWeekday
      : this.localeDictionary.onWeekday;
    return this.applyTemplate(template, {
      weekday: weekdayNames[dayNum]!,
    });
  }

  private formatSpecialExpression(expr: string): string {
    const special = this.localeDictionary.specialExpressions;
    switch (expr.toLowerCase()) {
      case "@yearly":
        return special.yearly;
      case "@annually":
        return special.annually;
      case "@monthly":
        return special.monthly;
      case "@weekly":
        return special.weekly;
      case "@daily":
        return special.daily;
      case "@midnight":
        return special.midnight;
      case "@hourly":
        return special.hourly;
      case "@reboot":
        return special.reboot;
      default:
        return this.applyTemplate(special.unknown, { expr });
    }
  }

  // New spec-based methods
  private describeTimeFromSpec(minuteRule: any, hourRule: any): string {
    const minute = this.ruleToString(minuteRule);
    const hour = this.ruleToString(hourRule);
    return this.describeTime(minute, hour);
  }

  private describeDayFromSpec(dayRule: any): string {
    const day = this.ruleToString(dayRule);
    return this.describeDay(day);
  }

  private describeWeekdayFromSpec(weekdayRule: any, hasDay: boolean): string {
    const weekday = this.ruleToString(weekdayRule);
    return this.describeWeekday(weekday, hasDay);
  }

  private describeMonthFromSpec(monthRule: any): string {
    const month = this.ruleToString(monthRule);
    return this.describeMonth(month);
  }

  private describeYearFromSpec(yearRule: any): string {
    const year = this.ruleToString(yearRule);
    return this.describeYear(year);
  }

  private describeYear(year: string): string {
    if (year === "*") {
      return "";
    }

    // Check if it contains a step (e.g., "*/4")
    if (year.includes("/")) {
      const [range, step] = year.split("/");
      const stepNum = parseInt(step!, 10);

      if (!range || range === "*") {
        return this.applyTemplate(this.localeDictionary.inEveryYear, {
          ordinal: this.localeDictionary.ordinal(stepNum),
        });
      }
    }

    // Single year
    return this.applyTemplate(this.localeDictionary.inYear, {
      year,
    });
  }

  private ruleToString(rule: any): string {
    // Handle "any" rule
    if ("any" in rule) {
      return "*";
    }

    // Handle single value
    if ("value" in rule) {
      return rule.value.toString();
    }

    // Handle range
    if ("rangeValues" in rule) {
      return `${rule.rangeValues.start}-${rule.rangeValues.end}`;
    }

    // Handle step
    if ("stepValues" in rule) {
      const { start, end, step } = rule.stepValues;

      // Detect */step pattern by checking if start/end match common min/max values
      const isFullRange =
        (start === 0 && end === 59) || // minutes
        (start === 0 && end === 23) || // hours
        (start === 1 && end === 31) || // day of month
        (start === 1 && end === 12) || // month
        (start === 0 && end === 7) || // day of week
        (start === 1970 && end === 3000); // year

      if (isFullRange) {
        return `*/${step}`;
      }

      // If it's a range with step (e.g., 6-12/4)
      if (start !== end) {
        return `${start}-${end}/${step}`;
      }

      // Otherwise just start/step (e.g., 6/4)
      return `${start}/${step}`;
    }

    // Handle list
    if ("listValues" in rule) {
      const values = rule.listValues.map((subRule: any) =>
        this.ruleToString(subRule),
      );
      return values.join(",");
    }

    return "*";
  }
}
