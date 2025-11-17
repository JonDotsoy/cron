/**
 * Tests that validate all examples from README.md
 * This ensures documentation examples are accurate and working
 */

import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { Cron } from "./cron";
import { CronFormat } from "./cron-format";
import { randomSpec } from "./utils";
import { Temporal } from "temporal-polyfill";

describe("README.md Examples", () => {
  describe("Basic Usage", () => {
    it("should iterate over next execution times", () => {
      const cron = new Cron("0 22 * * 1-5");

      let count = 0;
      const results: string[] = [];
      for (const datetime of cron) {
        results.push(datetime.toString());
        if (count++ >= 4) break;
      }

      expect(results).toHaveLength(5);
      results.forEach((result) => {
        expect(result).toContain("T22:00:00");
      });
    });
  });

  describe("Get Next Execution Time", () => {
    it("should get next execution time", () => {
      const cron = new Cron("0 9 * * MON-FRI");
      const nextExecution = Cron.next(cron);
      
      expect(nextExecution).toBeInstanceOf(Temporal.PlainDateTime);
      expect(nextExecution.hour).toBe(9);
      expect(nextExecution.minute).toBe(0);
    });
  });

  describe("Schedule with setInterval", () => {
    it("should schedule with setInterval and abort", () => {
      const cron = new Cron("*/5 * * * *");
      let executionCount = 0;

      const { abort } = Cron.setInterval(() => {
        executionCount++;
      }, cron);

      // Abort immediately for testing
      abort();

      expect(executionCount).toBe(0);
    });

    it("should support using keyword (Symbol.dispose)", () => {
      const cron = new Cron("*/5 * * * *");
      let executionCount = 0;

      const cronInterval = Cron.setInterval(() => {
        executionCount++;
      }, cron);

      // Test that Symbol.dispose exists and works
      expect(cronInterval[Symbol.dispose]).toBeDefined();
      cronInterval[Symbol.dispose]();
      
      expect(executionCount).toBe(0);
    });

    it("should support await using keyword (Symbol.asyncDispose)", async () => {
      const cron = new Cron("@reboot");
      let executionCount = 0;

      const cronInterval = Cron.setInterval(() => {
        executionCount++;
      }, cron);

      // Test that Symbol.asyncDispose exists and works
      expect(cronInterval[Symbol.asyncDispose]).toBeDefined();
      await cronInterval[Symbol.asyncDispose]();
      
      expect(executionCount).toBe(1); // @reboot executes once
    });
  });

  describe("Format Cron Expressions to Human-Readable Text", () => {
    it("should format cron expressions", () => {
      const formatter = new CronFormat("en");

      expect(formatter.format("0 22 * * 1-5")).toBe(
        "At 22:00 on every day-of-week from Monday through Friday."
      );

      expect(formatter.format("*/5 * * * *")).toBe("At every 5th minute.");

      expect(formatter.format("@weekly")).toBe("At 00:00 on Sunday.");
    });
  });

  describe("Format to Parts for Custom Rendering", () => {
    it("should format to parts", () => {
      const formatter = new CronFormat("en");
      const parts = formatter.formatToParts("0 22 * * 1-5");

      expect(parts).toBeArray();
      expect(parts.length).toBeGreaterThan(0);
      
      const hasLiteral = parts.some((p) => p.type === "literal");
      const hasHour = parts.some((p) => p.type === "hour");
      const hasMinute = parts.some((p) => p.type === "minute");
      
      expect(hasLiteral).toBe(true);
      expect(hasHour).toBe(true);
      expect(hasMinute).toBe(true);
    });
  });

  describe("Internationalization Support", () => {
    it("should support English locale", () => {
      const formatterEn = new CronFormat("en");
      const result = formatterEn.format("0 22 * * 1-5");
      
      expect(result).toBe(
        "At 22:00 on every day-of-week from Monday through Friday."
      );
    });

    it("should support Spanish locale", () => {
      const formatterEs = new CronFormat("es");
      const result = formatterEs.format("0 22 * * 1-5");
      
      expect(result).toBe(
        "A las 22:00 cada día de la semana del lunes al viernes."
      );
    });

    it("should support Intl.Locale", () => {
      const formatter = new CronFormat(new Intl.Locale("es"));
      const result = formatter.format("@daily");
      
      expect(result).toBe("A las 00:00.");
    });
  });

  describe("Supported Cron Syntax - Examples", () => {
    it("should parse every minute", () => {
      const cron = new Cron("* * * * *");
      expect(cron.expression).toBe("* * * * *");
    });

    it("should parse at 22:00 on weekdays", () => {
      const cron = new Cron("0 22 * * 1-5");
      expect(cron.expression).toBe("0 22 * * 1-5");
    });

    it("should parse at minute 23 past every 2nd hour from 0 through 20", () => {
      const cron = new Cron("23 0-20/2 * * *");
      expect(cron.expression).toBe("23 0-20/2 * * *");
    });

    it("should parse at 04:05 on Sunday", () => {
      const cron = new Cron("5 4 * * sun");
      expect(cron.expression).toBe("5 4 * * sun");
    });

    it("should parse at midnight on the 1st and 15th of each month", () => {
      const cron = new Cron("0 0 1,15 * *");
      expect(cron.expression).toBe("0 0 1,15 * *");
    });

    it("should parse every 2 minutes", () => {
      const cron = new Cron("*/2 * * * *");
      expect(cron.expression).toBe("*/2 * * * *");
    });

    it("should parse at 04:00 on every day from 8th through 14th", () => {
      const cron = new Cron("0 4 8-14 * *");
      expect(cron.expression).toBe("0 4 8-14 * *");
    });

    it("should parse in June, July, and August", () => {
      const cron = new Cron("* * * jun-aug *");
      expect(cron.expression).toBe("* * * jun-aug *");
    });

    it("should parse with specific year", () => {
      const cron = new Cron("0 0 1 1 * 2025");
      expect(cron.expression).toBe("0 0 1 1 * 2025");
    });
  });

  describe("Special Expressions", () => {
    it("should support @yearly", () => {
      const cron = new Cron("@yearly");
      expect(cron.expression).toBe("@yearly");
    });

    it("should support @monthly", () => {
      const cron = new Cron("@monthly");
      expect(cron.expression).toBe("@monthly");
    });

    it("should support @weekly", () => {
      const cron = new Cron("@weekly");
      expect(cron.expression).toBe("@weekly");
    });

    it("should support @daily", () => {
      const cron = new Cron("@daily");
      expect(cron.expression).toBe("@daily");
    });

    it("should support @hourly", () => {
      const cron = new Cron("@hourly");
      expect(cron.expression).toBe("@hourly");
    });

    it("should support @reboot", () => {
      const cron = new Cron("@reboot");
      expect(cron.expression).toBe("@reboot");
    });
  });

  describe("API - Cron.next()", () => {
    it("should return next execution time", () => {
      const cron = new Cron("0 12 * * *");
      const nextRun = Cron.next(cron);
      
      expect(nextRun).toBeInstanceOf(Temporal.PlainDateTime);
      expect(nextRun.hour).toBe(12);
      expect(nextRun.minute).toBe(0);
    });

    it("should throw error for @reboot", () => {
      const cron = new Cron("@reboot");
      
      expect(() => Cron.next(cron)).toThrow();
    });
  });

  describe("API - Cron.take()", () => {
    it("should return array of next N execution times", () => {
      const cron = new Cron("0 */6 * * *");
      const next5Runs = Cron.take(cron, 5);
      
      expect(next5Runs).toBeArray();
      expect(next5Runs).toHaveLength(5);
      
      next5Runs.forEach((dt) => {
        expect(dt).toBeInstanceOf(Temporal.PlainDateTime);
        expect(dt.minute).toBe(0);
        expect(dt.hour % 6).toBe(0);
      });
    });

    it("should throw error for @reboot", () => {
      const cron = new Cron("@reboot");
      
      expect(() => Cron.take(cron, 5)).toThrow();
    });
  });

  describe("API - CronFormat.format()", () => {
    it("should format various cron expressions", () => {
      const formatter = new CronFormat("en");
      
      expect(formatter.format("0 22 * * 1-5")).toBe(
        "At 22:00 on every day-of-week from Monday through Friday."
      );
      
      expect(formatter.format("*/5 * * * *")).toBe("At every 5th minute.");
      
      expect(formatter.format("@weekly")).toBe("At 00:00 on Sunday.");
    });
  });

  describe("API - CronFormat.formatToParts()", () => {
    it("should return parts with correct types", () => {
      const formatter = new CronFormat("en");
      const parts = formatter.formatToParts("5 4 * * *");
      
      expect(parts).toBeArray();
      
      const types = parts.map((p) => p.type);
      expect(types).toContain("literal");
      expect(types).toContain("hour");
      expect(types).toContain("minute");
      
      const hourPart = parts.find((p) => p.type === "hour");
      const minutePart = parts.find((p) => p.type === "minute");
      
      expect(hourPart?.value).toBe("04");
      expect(minutePart?.value).toBe("05");
    });
  });

  describe("Utilities - randomSpec()", () => {
    it("should generate random spec", () => {
      const spec = randomSpec();
      
      expect(spec).toBeDefined();
      // Check if it's either a special expression or has standard fields
      if ("@special" in spec) {
        expect(spec["@special"]).toBe("reboot");
      } else {
        expect(spec).toHaveProperty("minute");
        expect(spec).toHaveProperty("hour");
        expect(spec).toHaveProperty("dayOfMonth");
        expect(spec).toHaveProperty("month");
        expect(spec).toHaveProperty("dayOfWeek");
      }
    });

    it("should create Cron from random spec", () => {
      const spec = randomSpec();
      const cron = Cron.fromSpec(spec);
      
      expect(cron).toBeInstanceOf(Cron);
      expect(cron.expression).toBeDefined();
    });

    it("should generate multiple different random specs", () => {
      const specs: string[] = [];
      
      for (let i = 0; i < 10; i++) {
        const spec = randomSpec();
        const cron = Cron.fromSpec(spec);
        specs.push(cron.expression);
      }
      
      expect(specs).toHaveLength(10);
      // At least some should be different (very high probability)
      const uniqueSpecs = new Set(specs);
      expect(uniqueSpecs.size).toBeGreaterThan(1);
    });
  });

  describe("Cron Instance Properties", () => {
    it("should have expression property", () => {
      const cron = new Cron("0 22 * * 1-5");
      expect(cron.expression).toBe("0 22 * * 1-5");
    });

    it("should have now property", () => {
      const now = Temporal.Now.plainDateTimeISO();
      const cron = new Cron("0 22 * * 1-5", now);
      
      expect(cron.now).toBeDefined();
      expect(cron.now).toBeInstanceOf(Temporal.PlainDateTime);
    });

    it("should have spec property", () => {
      const cron = new Cron("0 22 * * 1-5");
      
      expect(cron.spec).toBeDefined();
      expect(cron.spec).toHaveProperty("minute");
      expect(cron.spec).toHaveProperty("hour");
    });
  });

  describe("Iterator Protocol", () => {
    it("should be iterable", () => {
      const cron = new Cron("0 0 * * *");
      
      expect(cron[Symbol.iterator]).toBeDefined();
      expect(typeof cron[Symbol.iterator]).toBe("function");
    });

    it("should throw error when iterating @reboot", () => {
      const cron = new Cron("@reboot");
      
      expect(() => {
        for (const _ of cron) {
          break;
        }
      }).toThrow();
    });
  });
});
