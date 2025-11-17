import { describe, test, expect } from "bun:test";
import { Cron } from "./cron";
import { CronFormat } from "./cron-format";
import { randomSpec } from "./utils";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

// Función para generar expresiones cron aleatorias usando randomSpec
function generateRandomCronExpressions(count: number): string[] {
  const expressions: string[] = [];

  // Generar expresiones aleatorias usando randomSpec y Cron.fromSpec
  for (let i = 0; i < count; i++) {
    const spec = randomSpec();
    const cron = Cron.fromSpec(spec);
    expressions.push(cron.expression);
  }

  return expressions;
}

// Cargar o generar datos de demostración
function loadOrGenerateDemoData(name: string, count: number): string[] {
  const demoDir = join(process.cwd(), "__demo__");
  const demoFile = join(demoDir, `${name}.json`);

  // Crear directorio si no existe
  if (!existsSync(demoDir)) {
    mkdirSync(demoDir, { recursive: true });
  }

  // Si el archivo existe, cargarlo
  if (existsSync(demoFile)) {
    const content = readFileSync(demoFile, "utf-8");
    return JSON.parse(content);
  }

  // Generar nuevos datos
  const data = generateRandomCronExpressions(count);
  writeFileSync(demoFile, JSON.stringify(data, null, 2), "utf-8");

  return data;
}

// Validar que no haya NaN en el spec
function validateNoNaN(spec: any): void {
  const specString = JSON.stringify(spec);
  expect(specString).not.toContain("NaN");

  // Validación recursiva más profunda
  function checkForNaN(obj: any, path: string = ""): void {
    if (typeof obj === "number") {
      expect(Number.isNaN(obj)).toBe(false);
    } else if (typeof obj === "object" && obj !== null) {
      for (const key in obj) {
        checkForNaN(obj[key], path ? `${path}.${key}` : key);
      }
    }
  }

  checkForNaN(spec);
}

// Validar que no haya palabras en inglés en traducciones al español
function validateNoEnglishWords(formatted: string): void {
  // Lista de frases y palabras en inglés que NO deben aparecer en español
  const englishPhrases = [
    "At every",
    "at every",
    "past hour",
    "Past hour",
    "past every",
    "Past every",
    "through",
    "Through",
    "day-of-month",
    "day-of-week",
    "and on",
    "January",
    "February",
    "March",
    "April",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Verificar frases completas
  for (const phrase of englishPhrases) {
    expect(formatted).not.toContain(phrase);
  }

  // Verificar ordinales en inglés como 1st, 2nd, 3rd, 4th usando regex
  const ordinalPattern = /\b\d+(st|nd|rd|th)\b/i;
  expect(formatted).not.toMatch(ordinalPattern);
}

// Cargar datos antes de definir las pruebas
const expressions = loadOrGenerateDemoData("cron-expressions", 200);

describe("Cron Integration Tests", () => {
  expressions.forEach((expression, index) => {
    describe(`Expression ${index + 1}: "${expression}"`, () => {
      test("should parse without errors", () => {
        expect(() => new Cron(expression)).not.toThrow();
      });

      test("should not contain NaN in spec", () => {
        const cron = new Cron(expression);
        validateNoNaN(cron.spec);
      });

      test("should format to English (en)", () => {
        const cron = new Cron(expression);
        const formatter = new CronFormat("en");
        const formatted = formatter.format(cron);

        expect(formatted).toBeTruthy();
        expect(formatted).not.toContain("NaN");
        expect(formatted).not.toContain("undefined");
        expect(typeof formatted).toBe("string");
        expect(formatted).toMatchSnapshot();
      });

      test("should format to Spanish (es)", () => {
        const cron = new Cron(expression);
        const formatter = new CronFormat("es");
        const formatted = formatter.format(cron);

        expect(formatted).toBeTruthy();
        expect(formatted).not.toContain("NaN");
        expect(formatted).not.toContain("undefined");
        expect(typeof formatted).toBe("string");

        // Validar que no haya palabras en inglés
        validateNoEnglishWords(formatted);

        expect(formatted).toMatchSnapshot();
      });

      test("should format to Chilean Slang Spanish (es-CL-Flaite)", () => {
        const cron = new Cron(expression);
        // Nota: es-CL-Flaite no existe en locales, fallback a es
        const formatter = new CronFormat("es-CL");
        const formatted = formatter.format(cron);

        expect(formatted).toBeTruthy();
        expect(formatted).not.toContain("NaN");
        expect(formatted).not.toContain("undefined");
        expect(typeof formatted).toBe("string");

        // Validar que no haya palabras en inglés
        validateNoEnglishWords(formatted);

        expect(formatted).toMatchSnapshot();
      });
    });
  });
});
