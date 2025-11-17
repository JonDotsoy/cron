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
        "Entre el minuto 2 y el 7 pasao' las 4, la mansa volá, pero sólo los días 5 y 7, ñeri, y encima tiene que caer miércoles o viernes, la dura en abril, junio y octubre, cachái y más encima la cuestión pasa cada 4 años, la mansa volá brígida.";
      expect(formatter.format(cron)).toBe(expected);
    });

    it('formatea "* * * * *" como "La weá corre cada minuto."', () => {
      const cron = "* * * * *";
      const expected = "Hermano, esta weá corre cada minuto, cachái.";
      expect(formatter.format(cron)).toBe(expected);
    });

    it('formatea "5 4 * * *" como "La weá corre a las 04:05."', () => {
      const cron = "5 4 * * *";
      const expected = "A las 04:05, hermano.";
      expect(formatter.format(cron)).toBe(expected);
    });

    it('formatea "0 22 * * 1-5" con estilo flaite', () => {
      const cron = "0 22 * * 1-5";
      const expected = "A las 22:00, hermano del lunes al viernes, cachái.";
      expect(formatter.format(cron)).toBe(expected);
    });

    it('formatea "15 14 1 * *" con estilo flaite', () => {
      const cron = "15 14 1 * *";
      const expected = "A las 14:15, hermano, pero sólo los días 1, ñeri.";
      expect(formatter.format(cron)).toBe(expected);
    });

    it('formatea "@weekly" con estilo flaite', () => {
      const cron = "@weekly";
      const expected = "A las 00:00, hermano los domingo, hermano.";
      expect(formatter.format(cron)).toBe(expected);
    });

    it('formatea "@daily" con estilo flaite', () => {
      const cron = "@daily";
      const expected = "A las 00:00, hermano.";
      expect(formatter.format(cron)).toBe(expected);
    });

    it('formatea "@hourly" con estilo flaite', () => {
      const cron = "@hourly";
      const expected = "Al minuto 0, al toque.";
      expect(formatter.format(cron)).toBe(expected);
    });

    it("acepta una instancia de Cron como parámetro", () => {
      const cronInstance = new Cron("* * * * *");
      const expected = "Hermano, esta weá corre cada minuto, cachái.";
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
        "Entre el minuto 2 y el 7 pasao' las 4, la mansa volá, pero sólo los días 5 y 7, ñeri, y encima tiene que caer miércoles o viernes, la dura en abril, junio y octubre, cachái en 2025, hermano.";
      expect(formatter.format(cron)).toBe(expected);
    });

    it('formatea "*/6 * * */5 4-3/4 2024" con rango invertido en dayOfWeek', () => {
      const cron = "*/6 * * */5 4-3/4 2024";
      const result = formatter.format(cron);

      // Verify no NaN in the output
      expect(result).not.toContain("NaN");

      // Verify the expected components are present
      expect(result).toContain("Cada 6");
      expect(result).toContain("cada 5 mes");
      expect(result).toContain("2024");
    });

    describe("formatToParts", () => {
      it('devuelve partes para "2-7 4 5,7 4,6,10 3,5 */4"', () => {
        const cron = "2-7 4 5,7 4,6,10 3,5 */4";
        const parts = formatter.formatToParts(cron);

        expect(parts).toEqual([
          {
            type: "time",
            value: "Entre el minuto 2 y el 7 pasao' las 4, la mansa volá",
          },
          { type: "literal", value: " " },
          { type: "day", value: ", pero sólo los días 5 o 7, ñeri" },
          { type: "literal", value: " " },
          {
            type: "weekday",
            value: ", y encima tiene que caer miércoles o viernes, la dura",
          },
          { type: "literal", value: " " },
          { type: "month", value: " en abril o junio o octubre, cachái" },
          { type: "literal", value: " " },
          {
            type: "year",
            value:
              " y más encima la cuestión pasa cada 4 años, la mansa volá brígida",
          },
          { type: "literal", value: "." },
        ]);
      });

      it('devuelve partes para "* * * * *"', () => {
        const cron = "* * * * *";
        const parts = formatter.formatToParts(cron);

        expect(parts).toEqual([
          {
            type: "time",
            value: "Hermano, esta weá corre cada minuto, cachái",
          },
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
