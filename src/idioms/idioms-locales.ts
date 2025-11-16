// src/idioms/idioms-locales.ts

import {
  template,
  type LocaleDictionary,
  locales as baseLocales,
} from "../locales";

export const idiomsLocales: Record<string, LocaleDictionary> = {
  ...baseLocales,
  "es-CL-Flaite": {
    // Time expressions
    atEveryMinute: template`La weá corre cada minuto`,
    atEveryMinutePastHour: template`La weá corre cada minuto pasao' las ${"hour"}`,
    atMinute: template`La weá corre al minuto ${"minute"}`,
    atMinutePastHour: template`La weá corre al minuto ${"minute"} pasao' las ${"hour"}`,
    atEveryMinuteFromThroughPastHour: template`La weá corre entre el minuto ${"start"} y el ${"end"} pasao' las ${"hour"} de la mañana`,
    atTime: template`La weá corre a las ${"time"}`,

    // Day expressions
    onDayOfMonth: template`, sólo los días ${"day"}`,
    onEveryDayOfMonthFromThrough: template`cada día del mes del ${"start"} al ${"end"}, terrible específico`,

    // Weekday expressions
    onWeekday: template`los ${"weekday"}`,
    andOnWeekday: template`, y encima tiene que caer ${"weekday"}…`,
    onEveryDayOfWeekFromThrough: template`del ${"start"} al ${"end"}`,

    // Month expressions
    inMonth: template` en ${"month"}`,
    inMonths: template` en ${"months"}`,
    everyMonth: template`cada ${"ordinal"} mes`,
    everyMonthFromThrough: template`cada ${"ordinal"} mes desde ${"start"} hasta ${"end"}`,
    everyMonthFromThroughRange: template`desde ${"start"} hasta ${"end"}`,

    // Year expressions
    inYear: template`en ${"year"}`,
    inEveryYear: template` y más encima la cuestión pasa cada ${"ordinal"} años. Terrible específica la volá`,

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
      "domingo",
      "lunes",
      "martes",
      "miércoles",
      "jueves",
      "viernes",
      "sábado",
    ],

    // Conjunctions and formatting
    and: "o",
    ordinal: (n: number) => {
      return n.toString();
    },

    // Special expressions
    specialExpressions: {
      yearly:
        "La weá corre a las 00:00 el día 1 de enero. Una vez al año no más.",
      annually:
        "La weá corre a las 00:00 el día 1 de enero. Una vez al año no más.",
      monthly:
        "La weá corre a las 00:00 el primer día del mes. Todos los meses, ¿cachai?",
      weekly: "La weá corre a las 00:00 el domingo. Una vez a la semana.",
      daily: "La weá corre a las 00:00. Todos los días, compadre.",
      midnight: "La weá corre a medianoche, ¿cachai?",
      hourly: "La weá corre cada hora en punto.",
      reboot: "La weá corre cuando reinicie el compu, ¿cachai?",
      unknown: template`No cacho esa expresión: ${"expr"}. Terrible rara la volá.`,
    },
  },
};
