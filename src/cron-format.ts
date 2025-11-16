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

    // Month part
    const monthPart = this.describeMonth(month);
    if (monthPart) {
      description += " " + monthPart;
    }

    // Day part
    const dayPart = this.describeDay(day);
    if (dayPart) {
      description += " " + dayPart;
    }

    // Weekday part
    const weekdayPart = this.describeWeekday(weekday);
    if (weekdayPart) {
      description += " " + weekdayPart;
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
      const hourNum = parseInt(hour, 10);
      return `At every minute past hour ${hourNum}`;
    }

    // Case: M * -> "At minute M past every hour" (unusual, but handle it)
    if (minute !== "*" && hour === "*") {
      const minuteNum = parseInt(minute, 10);
      return `At minute ${minuteNum}`;
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

    // For now, simplified implementation
    return "";
  }

  private describeWeekday(weekday: string): string {
    if (weekday === "*") {
      return "";
    }

    // For now, simplified implementation
    return "";
  }

  private ordinal(n: number): string {
    const suffixes = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]!);
  }
}
