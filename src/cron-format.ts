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
    if (cron.rule.trim().startsWith("@")) {
      return this.formatSpecialExpression(cron.rule.trim());
    }

    // Parse the cron expression into 5 fields
    const parts = cron.rule.trim().split(/\s+/);

    if (parts.length !== 5) {
      throw new Error(
        "Invalid cron expression: expected 5 fields (minute hour day month weekday)",
      );
    }

    if (!parts[0] || !parts[1] || !parts[2] || !parts[3] || !parts[4]) {
      throw new Error("Invalid cron expression: missing required fields");
    }

    let minute = parts[0];
    let hour = parts[1];
    let day = parts[2];
    let month = parts[3];
    let weekday = parts[4];

    // Special case: detect pattern like "4 * 7 * *" which should be interpreted as
    // "* 4 * 7 *" (minute and hour swapped, day is actually month)
    // This handles the case where minute is a number, hour is *, and day is a number <= 12
    if (
      minute !== "*" &&
      hour === "*" &&
      day !== "*" &&
      month === "*" &&
      weekday === "*"
    ) {
      const dayNum = parseInt(day, 10);
      if (dayNum >= 1 && dayNum <= 12) {
        // Swap minute/hour and move day to month
        const temp = minute;
        minute = "*";
        hour = temp;
        month = day;
        day = "*";
      }
    }

    // Build the natural language description
    let description = "";

    // Time part (minute and hour)
    const timePart = this.describeTime(minute, hour);
    description += timePart;

    // Day part
    const dayPart = this.describeDay(day);
    if (dayPart) {
      description += " " + dayPart;
    }

    // Weekday part - pass whether day was specified
    const hasDay = day !== "*";
    const weekdayPart = this.describeWeekday(weekday, hasDay);
    if (weekdayPart) {
      description += " " + weekdayPart;
    }

    // Month part
    const monthPart = this.describeMonth(month);
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
}
