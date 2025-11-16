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

  // Year expressions
  inYear: TemplateResult;
  inEveryYear: TemplateResult;

  // Month names
  monthNames: string[];

  // Weekday names
  weekdayNames: string[];

  // Conjunctions and formatting
  and: string;
  ordinal: (n: number) => string;

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

    // Year expressions
    inYear: template`in ${"year"}`,
    inEveryYear: template`in every ${"ordinal"} year`,

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

    // Conjunctions and formatting
    and: "and",
    ordinal: (n: number) => {
      const suffixes = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]!);
    },

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
  es: {
    // Time expressions
    atEveryMinute: template`Cada minuto`,
    atEveryMinutePastHour: template`Cada minuto después de la hora ${"hour"}`,
    atMinute: template`Al minuto ${"minute"}`,
    atMinutePastHour: template`Al minuto ${"minute"} después de la hora ${"hour"}`,
    atEveryMinuteFromThroughPastHour: template`Cada minuto del ${"start"} al ${"end"} después de la hora ${"hour"}`,
    atTime: template`A las ${"time"}`,

    // Day expressions
    onDayOfMonth: template`los días ${"day"} del mes`,
    onEveryDayOfMonthFromThrough: template`cada día del mes del ${"start"} al ${"end"}`,

    // Weekday expressions
    onWeekday: template`los ${"weekday"}`,
    andOnWeekday: template`y los ${"weekday"}`,
    onEveryDayOfWeekFromThrough: template`cada día de la semana del ${"start"} al ${"end"}`,

    // Month expressions
    inMonth: template`de ${"month"}`,
    inMonths: template`de ${"months"}`,
    everyMonth: template`cada ${"ordinal"} mes`,
    everyMonthFromThrough: template`cada ${"ordinal"} mes desde ${"start"} hasta ${"end"}`,
    everyMonthFromThroughRange: template`cada mes desde ${"start"} hasta ${"end"}`,

    // Year expressions
    inYear: template`en ${"year"}`,
    inEveryYear: template`cada ${"ordinal"} año`,

    // Month names
    monthNames: [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ],

    // Weekday names
    weekdayNames: [
      "domingos",
      "lunes",
      "martes",
      "miércoles",
      "jueves",
      "viernes",
      "sábados",
    ],

    // Conjunctions and formatting
    and: "y",
    ordinal: (n: number) => {
      const ordinals: Record<number, string> = {
        1: "primer",
        2: "segundo",
        3: "tercer",
        4: "cuarto",
        5: "quinto",
        6: "sexto",
        7: "séptimo",
        8: "octavo",
        9: "noveno",
        10: "décimo",
      };
      return ordinals[n] || `${n}º`;
    },

    // Special expressions
    specialExpressions: {
      yearly: "A las 00:00 el día 1 del mes en enero.",
      annually: "A las 00:00 el día 1 del mes en enero.",
      monthly: "A las 00:00 el día 1 del mes.",
      weekly: "A las 00:00 el domingo.",
      daily: "A las 00:00.",
      midnight: "A las 00:00.",
      hourly: "Al minuto 0.",
      reboot: "Al reiniciar.",
      unknown: template`Expresión especial desconocida: ${"expr"}.`,
    },
  },
};
