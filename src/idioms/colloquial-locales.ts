// src/idioms/colloquial-locales.ts

import {
  template,
  type LocaleDictionary,
  locales as baseLocales,
} from "../locales";

export const colloquialLocales: Record<string, LocaleDictionary> = {
  ...baseLocales,
  "es-CL-Flaite": {
    // Time expressions
    atEveryMinute: template`Hermano, esta weá corre cada minuto, cachái`,
    atEveryMinutePastHour: template`La weá corre cada minuto pasao' las ${"hour"}, al toque`,
    atEveryMinutePastEveryHour: template`Ñeri, corre cada minuto pasao' cada ${"ordinal"} hora, brígido`,
    atEveryMinutePastEveryHourFromThrough: template`Loco, corre cada minuto pasao' cada ${"ordinal"} hora desde las ${"start"} hasta las ${"end"}, la dura`,
    atEveryMinutePastEveryHourFrom: template`Bro, corre cada minuto pasao' cada ${"ordinal"} hora desde las ${"start"}, cachái`,
    atMinutePastEveryHour: template`Al minuto ${"minute"} pasao' cada ${"ordinal"} hora, hermano`,
    atMinutePastEveryHourFromThrough: template`Al minuto ${"minute"} pasao' cada ${"ordinal"} hora desde las ${"start"} hasta las ${"end"}, terrible específico`,
    atMinutePastEveryHourFrom: template`Al minuto ${"minute"} pasao' cada ${"ordinal"} hora desde las ${"start"}, ñeri`,
    atMinute: template`Al minuto ${"minute"}, al toque`,
    atMinutePastHour: template`Al minuto ${"minute"} pasao' las ${"hour"}, cachái`,
    atEveryMinuteFromThroughPastHour: template`Entre el minuto ${"start"} y el ${"end"} pasao' las ${"hour"}, la mansa volá`,
    atTime: template`A las ${"time"}, hermano`,
    atEveryMinuteWithStep: template`Cada ${"ordinal"} minuto, al toque`,
    atEveryMinuteFromThroughWithStep: template`Cada ${"ordinal"} minuto del ${"start"} al ${"end"}, brígido`,
    atEveryMinuteFromWithStep: template`Cada ${"ordinal"} minuto desde el ${"start"}, cachái`,

    // Day expressions
    onDayOfMonth: template`, pero sólo los días ${"day"}, ñeri`,
    onEveryDayOfMonthFromThrough: template`cada día del mes del ${"start"} al ${"end"}, qué weá más brígida`,

    // Weekday expressions
    onWeekday: template`los ${"weekday"}, hermano`,
    andOnWeekday: template`, y encima tiene que caer ${"weekday"}, la dura`,
    onEveryDayOfWeekFromThrough: template`del ${"start"} al ${"end"}, cachái`,
    onEveryDayOfWeekFromThroughWithStep: template`cada ${"ordinal"} día de la semana del ${"start"} al ${"end"}, qué weá más cuática`,
    onEveryWeekday: template`cada ${"ordinal"} día de la semana, bro`,
    onEveryWeekdayFrom: template`cada ${"ordinal"} día de la semana desde el ${"start"}, al toque`,

    // Month expressions
    inMonth: template` en ${"month"}, hermano`,
    inMonths: template` en ${"months"}, cachái`,
    everyMonth: template`cada ${"ordinal"} mes, ñeri`,
    everyMonthFromThrough: template`cada ${"ordinal"} mes desde ${"start"} hasta ${"end"}, brígido`,
    everyMonthFromThroughRange: template`desde ${"start"} hasta ${"end"}, loco`,

    // Year expressions
    inYear: template`en ${"year"}, hermano`,
    inEveryYear: template` y más encima la cuestión pasa cada ${"ordinal"} años, la mansa volá brígida`,

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
        "Hermano, la weá corre a las 00:00 el día 1 de enero. Una vez al año no más, cachái.",
      annually:
        "Ñeri, la weá corre a las 00:00 el día 1 de enero. Una vez al año no más, al toque.",
      monthly:
        "Loco, la weá corre a las 00:00 el primer día del mes. Todos los meses, brígido, ¿cachái?",
      weekly: "Bro, la weá corre a las 00:00 el domingo. Una vez a la semana, la dura.",
      daily: "Hermano, la weá corre a las 00:00. Todos los días, al toque, cachái.",
      midnight: "La weá corre a medianoche, ñeri, terrible brígido.",
      hourly: "Loco, la weá corre cada hora en punto, al toque.",
      reboot: "Hermano, la weá corre cuando reinicie el compu, ¿cachái? Al toque no más.",
      unknown: template`Ñeri, no cacho esa expresión: ${"expr"}. Qué weá más cuática, la dura.`,
    },
  },
};
