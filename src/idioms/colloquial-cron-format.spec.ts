// src/idioms/colloquial-cron-format.spec.ts

import { describe, expect, it, beforeEach } from "bun:test";
import { ColloquialCronFormat } from "./colloquial-cron-format";
import { Cron } from "../cron";

describe("ColloquialCronFormat", () => {
  describe("es-CL-Flaite", () => {
    let formatter: ColloquialCronFormat;

    beforeEach(() => {
      formatter = new ColloquialCronFormat("es-CL-Flaite");
    });

    it('formatea "2-7 4 5,7 4,6,10 3,5 */4" en estilo flaite chileno', () => {
      const cron = "2-7 4 5,7 4,6,10 3,5 */4";
      const expected =
        "La weá corre entre el minuto 2 y el 7 pasao' las 4 de la mañana, sólo los días 5 y 7, y encima tiene que caer miércoles o viernes… en abril, junio y octubre, y más encima la cuestión pasa cada 4 años. Terrible específica la volá.";
      expect(formatter.format(cron)).toBe(expected);
    });

    it('formatea "* * * * *" como "La weá corre cada minuto."', () => {
      const cron = "* * * * *";
      const expected = "La weá corre cada minuto.";
      expect(formatter.format(cron)).toBe(expected);
    });

    it('formatea "5 4 * * *" como "La weá corre a las 04:05."', () => {
      const cron = "5 4 * * *";
      const expected = "La weá corre a las 04:05.";
      expect(formatter.format(cron)).toBe(expected);
    });

    it('formatea "0 22 * * 1-5" con estilo flaite', () => {
      const cron = "0 22 * * 1-5";
      const expected = "La weá corre a las 22:00 del lunes al viernes.";
      expect(formatter.format(cron)).toBe(expected);
    });

    it('formatea "15 14 1 * *" con estilo flaite', () => {
      const cron = "15 14 1 * *";
      const expected = "La weá corre a las 14:15, sólo los días 1.";
      expect(formatter.format(cron)).toBe(expected);
    });

    it('formatea "@weekly" con estilo flaite', () => {
      const cron = "@weekly";
      const expected = "La weá corre a las 00:00 los domingo.";
      expect(formatter.format(cron)).toBe(expected);
    });

    it('formatea "@daily" con estilo flaite', () => {
      const cron = "@daily";
      const expected = "La weá corre a las 00:00.";
      expect(formatter.format(cron)).toBe(expected);
    });

    it('formatea "@hourly" con estilo flaite', () => {
      const cron = "@hourly";
      const expected = "La weá corre al minuto 0.";
      expect(formatter.format(cron)).toBe(expected);
    });

    it("acepta una instancia de Cron como parámetro", () => {
      const cronInstance = new Cron("* * * * *");
      const expected = "La weá corre cada minuto.";
      expect(formatter.format(cronInstance)).toBe(expected);
    });

    it("acepta Intl.Locale en el constructor", () => {
      const formatterWithLocale = new ColloquialCronFormat(
        new Intl.Locale("es", { region: "CL" }),
      );
      const cron = "5 4 * * *";
      // Should fallback to base Spanish since "es-CL" is not defined
      const result = formatterWithLocale.format(cron);
      expect(result).toBeTruthy();
    });

    it('formatea expresión con año específico "2-7 4 5,7 4,6,10 3,5 2025"', () => {
      const cron = "2-7 4 5,7 4,6,10 3,5 2025";
      const expected =
        "La weá corre entre el minuto 2 y el 7 pasao' las 4 de la mañana, sólo los días 5 y 7, y encima tiene que caer miércoles o viernes… en abril, junio y octubre, en 2025.";
      expect(formatter.format(cron)).toBe(expected);
    });

    describe("formatToParts", () => {
      it('devuelve partes para "2-7 4 5,7 4,6,10 3,5 */4"', () => {
        const cron = "2-7 4 5,7 4,6,10 3,5 */4";
        const parts = formatter.formatToParts(cron);

        expect(parts).toEqual([
          {
            type: "time",
            value:
              "La weá corre entre el minuto 2 y el 7 pasao' las 4 de la mañana",
          },
          { type: "literal", value: " " },
          { type: "day", value: ", sólo los días 5 o 7" },
          { type: "literal", value: " " },
          {
            type: "weekday",
            value: ", y encima tiene que caer miércoles o viernes…",
          },
          { type: "literal", value: " " },
          { type: "month", value: " en abril o junio o octubre" },
          { type: "literal", value: " " },
          {
            type: "year",
            value:
              " y más encima la cuestión pasa cada 4 años. Terrible específica la volá",
          },
          { type: "literal", value: "." },
        ]);
      });

      it('devuelve partes para "* * * * *"', () => {
        const cron = "* * * * *";
        const parts = formatter.formatToParts(cron);

        expect(parts).toEqual([
          { type: "time", value: "La weá corre cada minuto" },
          { type: "literal", value: "." },
        ]);
      });
    });
  });

  describe("Herencia de locales base", () => {
    it("soporta locale 'en' heredado", () => {
      const formatter = new ColloquialCronFormat("en");
      const cron = "* * * * *";
      const expected = "At every minute.";
      expect(formatter.format(cron)).toBe(expected);
    });

    it("soporta locale 'es' heredado", () => {
      const formatter = new ColloquialCronFormat("es");
      const cron = "* * * * *";
      const expected = "Cada minuto.";
      expect(formatter.format(cron)).toBe(expected);
    });
  });
});
