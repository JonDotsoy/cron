// src/locales.ts

export const template = (template: TemplateStringsArray, ...keys: string[]) => {
  return {
    template: {
      raw: template,
      substitutionsKeys: keys,
    },
  };
};

type TemplateResult = ReturnType<typeof template>;

export interface LocaleDictionary {
  // Time expressions
  atEveryMinute: TemplateResult;
  atEveryMinutePastHour: TemplateResult;
  atMinute: TemplateResult;
  atMinutePastHour: TemplateResult;
  atEveryMinuteFromThroughPastHour: TemplateResult;
  atTime: TemplateResult;

  // Day expressions
  onDayOfMonth: TemplateResult;
  onEveryDayOfMonthFromThrough: TemplateResult;

  // Weekday expressions
  onWeekday: TemplateResult;
  andOnWeekday: TemplateResult;
  onEveryDayOfWeekFromThrough: TemplateResult;

  // Month expressions
  inMonth: TemplateResult;
  inMonths: TemplateResult;
  everyMonth: TemplateResult;
  everyMonthFromThrough: TemplateResult;
  everyMonthFromThroughRange: TemplateResult;

  // Month names
  monthNames: string[];

  // Weekday names
  weekdayNames: string[];

  // Special expressions
  specialExpressions: {
    yearly: string;
    annually: string;
    monthly: string;
    weekly: string;
    daily: string;
    midnight: string;
    hourly: string;
    reboot: string;
    unknown: TemplateResult;
  };
}

export const locales: Record<string, LocaleDictionary> = {
  en: {
    // Time expressions
    atEveryMinute: template`At every minute`,
    atEveryMinutePastHour: template`At every minute past hour ${"hour"}`,
    atMinute: template`At minute ${"minute"}`,
    atMinutePastHour: template`At minute ${"minute"} past hour ${"hour"}`,
    atEveryMinuteFromThroughPastHour: template`At every minute from ${"start"} through ${"end"} past hour ${"hour"}`,
    atTime: template`At ${"time"}`,

    // Day expressions
    onDayOfMonth: template`on day-of-month ${"day"}`,
    onEveryDayOfMonthFromThrough: template`on every day-of-month from ${"start"} through ${"end"}`,

    // Weekday expressions
    onWeekday: template`on ${"weekday"}`,
    andOnWeekday: template`and on ${"weekday"}`,
    onEveryDayOfWeekFromThrough: template`on every day-of-week from ${"start"} through ${"end"}`,

    // Month expressions
    inMonth: template`in ${"month"}`,
    inMonths: template`in ${"months"}`,
    everyMonth: template`every ${"ordinal"} month`,
    everyMonthFromThrough: template`every ${"ordinal"} month from ${"start"} through ${"end"}`,
    everyMonthFromThroughRange: template`every month from ${"start"} through ${"end"}`,

    // Month names
    monthNames: [
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
    ],

    // Weekday names
    weekdayNames: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],

    // Special expressions
    specialExpressions: {
      yearly: "At 00:00 on day-of-month 1 in January.",
      annually: "At 00:00 on day-of-month 1 in January.",
      monthly: "At 00:00 on day-of-month 1.",
      weekly: "At 00:00 on Sunday.",
      daily: "At 00:00.",
      midnight: "At 00:00.",
      hourly: "At minute 0.",
      reboot: "At reboot.",
      unknown: template`Unknown special expression: ${"expr"}.`,
    },
  },
};
