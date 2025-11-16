// src/cron-format.ts

import { Cron } from "./cron";
import { locales, type LocaleDictionary } from "./locales";

export type CronExpression = string;

export interface ICronFormatter {
  format(cronExpression: Cron | CronExpression): string;
}

export type CronFormatPart = {
  type: "literal" | "time" | "minute" | "hour" | "day" | "weekday" | "month";
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
      const description = this.formatSpecialExpression(cron.rule.trim());
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

    // Add period at the end
    parts.push({ type: "literal", value: "." });

    return parts;
  }

  private parseTimeParts(timePart: string, parts: CronFormatPart[]): void {
    // Extract "At " prefix
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
    // Keep "on " or "and on " prefix as part of the weekday value
    parts.push({ type: "weekday", value: weekdayPart });
  }

  private parseMonthParts(monthPart: string, parts: CronFormatPart[]): void {
    // Keep "in " prefix as part of the month value
    parts.push({ type: "month", value: monthPart });
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
      // Check if hour is a list (e.g., "0,12")
      if (hour.includes(",")) {
        const hours = hour.split(",").map((h) => h.trim());
        return this.applyTemplate(this.localeDictionary.atMinutePastHour, {
          minute,
          hour: hours.join(" and "),
        });
      }
      const hourNum = parseInt(hour, 10);
      return this.applyTemplate(this.localeDictionary.atEveryMinutePastHour, {
        hour: hourNum.toString(),
      });
    }

    // Case: M * -> "At minute M past every hour" (unusual, but handle it)
    if (minute !== "*" && hour === "*") {
      const minuteNum = parseInt(minute, 10);
      return this.applyTemplate(this.localeDictionary.atMinute, {
        minute: minuteNum.toString(),
      });
    }

    // Check if hour has a step (e.g., "0-20/2" or "*/2")
    if (hour.includes("/") && minute !== "*") {
      const minuteNum = parseInt(minute, 10);
      const [rangePart, stepPart] = hour.split("/");

      if (!rangePart || !stepPart) {
        return this.applyTemplate(this.localeDictionary.atMinute, {
          minute: minuteNum.toString(),
        });
      }

      const step = parseInt(stepPart, 10);

      if (rangePart === "*") {
        return `At minute ${minuteNum} past every ${this.ordinal(step)} hour`;
      } else if (rangePart.includes("-")) {
        const [start, end] = rangePart.split("-");
        return `At minute ${minuteNum} past every ${this.ordinal(step)} hour from ${start} through ${end}`;
      } else {
        return `At minute ${minuteNum} past every ${this.ordinal(step)} hour from ${rangePart}`;
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
        hour: hours.join(" and "),
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

      // Join with " and "
      return this.applyTemplate(this.localeDictionary.inMonths, {
        months: descriptions.join(" and "),
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
          ordinal: this.ordinal(stepNum),
        });
      }

      // Range with step: 6/4 means "every 4th month from June through December"
      const startNum = parseInt(range, 10);
      const startMonth = monthNames[startNum - 1];
      const endMonth = monthNames[11]; // December (end of year)

      return this.applyTemplate(this.localeDictionary.everyMonthFromThrough, {
        ordinal: this.ordinal(stepNum),
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
        day: dayNumbers.join(" and "),
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
        weekday: dayNames.join(" and "),
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

  private ordinal(n: number): string {
    const suffixes = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]!);
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
        (start === 0 && end === 7); // day of week

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
