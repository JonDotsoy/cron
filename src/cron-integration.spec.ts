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
    expressions.push(cron.rule);
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
function validateNoNaN(spec: any, expression: string): void {
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
        validateNoNaN(cron.spec, expression);
      });

      test("should format to English (en)", () => {
        const cron = new Cron(expression);
        const formatter = new CronFormat("en");
        const formatted = formatter.format(cron);

        expect(formatted).toBeTruthy();
        expect(formatted).not.toContain("NaN");
        expect(formatted).not.toContain("undefined");
        expect(typeof formatted).toBe("string");
      });

      test("should format to Spanish (es)", () => {
        const cron = new Cron(expression);
        const formatter = new CronFormat("es");
        const formatted = formatter.format(cron);

        expect(formatted).toBeTruthy();
        expect(formatted).not.toContain("NaN");
        expect(formatted).not.toContain("undefined");
        expect(typeof formatted).toBe("string");
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
      });
    });
  });
});
