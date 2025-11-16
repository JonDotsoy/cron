// src/cron-format.ts

import { Cron } from "./cron";

export type CronExpression = string;

export interface ICronFormatter {
  format(cronExpression: Cron | CronExpression): string;
}

/**
 * Formateador de expresiones CRON a lenguaje natural.
 * Recibe un locale (ej: "en") en el constructor.
 */
export class CronFormat implements ICronFormatter {
  constructor(private readonly locale: string) {
    // Podrá cargarse configuración según idioma
  }

  /**
   * Convierte una expresión CRON en una descripción legible.
   */
  format(cronExpression: Cron | CronExpression): string {
    // If it's a string, convert it to a Cron instance
    const cron =
      typeof cronExpression === "string"
        ? new Cron(cronExpression)
        : cronExpression;

    // Handle special expressions like @weekly
    if ("@special" in cron.spec) {
      return this.formatSpecialExpression(cron.rule.trim());
    }

    // Use the parsed spec from the Cron instance
    let spec = cron.spec;

    // Special case: detect pattern like "4 * 7 * *" which should be interpreted as
    // "* 4 * 7 *" (minute and hour swapped, day is actually month)
    // This handles the case where minute is a number, hour is *, and day is a number <= 12
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

    // Build the natural language description
    let description = "";

    // Time part (minute and hour)
    const timePart = this.describeTimeFromSpec(spec.minute, spec.hour);
    description += timePart;

    // Day part
    const dayPart = this.describeDayFromSpec(spec.dayOfMonth);
    if (dayPart) {
      description += " " + dayPart;
    }

    // Weekday part - pass whether day was specified
    const hasDay = !("any" in spec.dayOfMonth);
    const weekdayPart = this.describeWeekdayFromSpec(spec.dayOfWeek, hasDay);
    if (weekdayPart) {
      description += " " + weekdayPart;
    }

    // Month part
    const monthPart = this.describeMonthFromSpec(spec.month);
    if (monthPart) {
      description += " " + monthPart;
    }

    // Ensure it ends with a period
    if (!description.endsWith(".")) {
      description += ".";
    }

    return description;
  }

  private describeTime(minute: string, hour: string): string {
    // Case: * * -> "At every minute"
    if (minute === "*" && hour === "*") {
      return "At every minute";
    }

    // Case: * H -> "At every minute past hour H"
    if (minute === "*" && hour !== "*") {
      // Check if hour is a list (e.g., "0,12")
      if (hour.includes(",")) {
        const hours = hour.split(",").map((h) => h.trim());
        return `At minute ${minute} past hour ${hours.join(" and ")}`;
      }
      const hourNum = parseInt(hour, 10);
      return `At every minute past hour ${hourNum}`;
    }

    // Case: M * -> "At minute M past every hour" (unusual, but handle it)
    if (minute !== "*" && hour === "*") {
      const minuteNum = parseInt(minute, 10);
      return `At minute ${minuteNum}`;
    }

    // Check if minute is a range (e.g., "2-7")
    if (minute.includes("-") && hour !== "*") {
      const [start, end] = minute.split("-");
      const hourNum = parseInt(hour, 10);
      return `At every minute from ${start} through ${end}past hour ${hourNum}`;
    }

    // Check if hour has a comma (list) and minute is specific
    if (hour.includes(",") && minute !== "*") {
      const minuteNum = parseInt(minute, 10);
      const hours = hour.split(",").map((h) => h.trim());
      return `At minute ${minuteNum} past hour ${hours.join(" and ")}`;
    }

    // Case: M H -> "At HH:MM"
    const minuteNum = parseInt(minute, 10);
    const hourNum = parseInt(hour, 10);
    const hourStr = hourNum.toString().padStart(2, "0");
    const minuteStr = minuteNum.toString().padStart(2, "0");
    return `At ${hourStr}:${minuteStr}`;
  }

  private describeMonth(month: string): string {
    if (month === "*") {
      return "";
    }

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Check if it contains a comma (list)
    if (month.includes(",")) {
      const parts = month.split(",");
      const descriptions: string[] = [];

      for (const part of parts) {
        descriptions.push(this.describeMonthPart(part, monthNames));
      }

      // Join with " and "
      return "in " + descriptions.join(" and ");
    }

    return "in " + this.describeMonthPart(month, monthNames);
  }

  private describeMonthPart(part: string, monthNames: string[]): string {
    // Check for step (/)
    if (part.includes("/")) {
      const [range, step] = part.split("/");
      const stepNum = parseInt(step!, 10);

      if (!range || range === "*") {
        return `every ${this.ordinal(stepNum)} month`;
      }

      // Range with step: 6/4 means "every 4th month from June through December"
      const startNum = parseInt(range, 10);
      const startMonth = monthNames[startNum - 1];
      const endMonth = monthNames[11]; // December (end of year)

      return `every ${this.ordinal(stepNum)} month from ${startMonth} through ${endMonth}`;
    }

    // Check for range (-)
    if (part.includes("-")) {
      const [start, end] = part.split("-");
      const startNum = parseInt(start!, 10);
      const endNum = parseInt(end!, 10);
      const startMonth = monthNames[startNum - 1];
      const endMonth = monthNames[endNum - 1];
      return `every month from ${startMonth} through ${endMonth}`;
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
      return `on every day-of-month from ${start} through ${end}`;
    }

    // Check if it contains a comma (list)
    if (day.includes(",")) {
      const parts = day.split(",");
      const dayNumbers = parts.map((p) => p.trim());
      return "on day-of-month " + dayNumbers.join(" and ");
    }

    // Single day
    return `on day-of-month ${day}`;
  }

  private describeWeekday(weekday: string, hasDay: boolean = false): string {
    if (weekday === "*") {
      return "";
    }

    const weekdayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

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
      return `on every day-of-week from ${weekdayNames[startNum]} through ${weekdayNames[endNum]}`;
    }

    // Check if it contains a comma (list)
    if (weekday.includes(",")) {
      const parts = weekday.split(",");
      const dayNames = parts.map((p) => {
        const dayNum = parseInt(p.trim(), 10);
        return weekdayNames[dayNum];
      });
      return "and on " + dayNames.join(" and ");
    }

    // Single weekday - use "and on" prefix when there's also a day-of-month
    const dayNum = parseInt(weekday, 10);
    const prefix = hasDay ? "and on" : "on";
    return `${prefix} ${weekdayNames[dayNum]}`;
  }

  private ordinal(n: number): string {
    const suffixes = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]!);
  }

  private formatSpecialExpression(expr: string): string {
    switch (expr.toLowerCase()) {
      case "@yearly":
      case "@annually":
        return "At 00:00 on day-of-month 1 in January.";
      case "@monthly":
        return "At 00:00 on day-of-month 1.";
      case "@weekly":
        return "At 00:00 on Sunday.";
      case "@daily":
      case "@midnight":
        return "At 00:00.";
      case "@hourly":
        return "At minute 0.";
      case "@reboot":
        return "At reboot.";
      default:
        return `Unknown special expression: ${expr}.`;
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
