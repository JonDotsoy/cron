import { Temporal } from "temporal-polyfill";
export { Temporal } from "temporal-polyfill";

type ValueRule = {
  value: number;
};

type AnyRule = {
  any: true;
};

type RangeValues = {
  rangeValues: {
    start: number;
    end: number;
  };
};

type StepValues = {
  stepValues: {
    start: number;
    end: number;
    step: number;
  };
};

type ListValues = {
  listValues: (RangeValues | StepValues | ValueRule)[];
};

type Rule = ValueRule | AnyRule | RangeValues | StepValues | ListValues;

type Spec =
  | {
      minute: Rule;
      hour: Rule;
      dayOfMonth: Rule;
      month: Rule;
      dayOfWeek: Rule;
      year: Rule;
    }
  | { "@special": "reboot" };

export class Cron {
  #spec: Spec;

  constructor(
    readonly rule: string,
    readonly now: Temporal.PlainDateTime = Temporal.Now.plainDateTimeISO(),
  ) {
    this.#spec = Cron.parseSpec(rule);
  }

  get spec(): Spec {
    return this.#spec;
  }

  *[Symbol.iterator](): Generator<Temporal.PlainDateTime> {
    if ("@special" in this.#spec) {
      throw new Error("Cannot iterate over @reboot expression");
    }

    // Start from current time, rounded to next mi ew   nute
    let current = Temporal.Now.plainDateTimeISO();
    current = current
      .add({ minutes: 1 })
      .with({ second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 });

    while (true) {
      if (this.matches(current)) {
        yield current;
        current = current.add({ minutes: 1 });
      } else {
        current = this.getNextCandidate(current);
      }
    }
  }

  static next(cron: Cron): Temporal.PlainDateTime {
    for (const datetime of cron) {
      return datetime;
    }
    throw new Error("No next datetime found");
  }

  static setInterval(callback: () => void, cron: Cron) {
    const abort = new AbortController();
    const promise = this.createInterval(callback, cron, abort.signal);

    return {
      promise,
      abort: () => abort.abort(),
    };
  }

  private static async createInterval(
    callback: () => void,
    cron: Cron,
    abortSignal?: AbortSignal,
  ) {
    // Handle @reboot: execute immediately once
    if ("@special" in cron.#spec && cron.#spec["@special"] === "reboot") {
      callback();
      return;
    }

    for (const datetime of cron) {
      const done = Promise.withResolvers<void>();
      const delay = datetime
        .since(Temporal.Now.plainDateTimeISO())
        .total("milliseconds");
      const timeout = setTimeout(() => {
        callback();
        done.resolve();
      }, delay);
      abortSignal?.addEventListener("abort", () => {
        clearTimeout(timeout);
        done.resolve();
      });

      await done.promise;
    }
  }

  private matches(dt: Temporal.PlainDateTime): boolean {
    if ("@special" in this.#spec) {
      return false;
    }

    return (
      this.matchesRule(dt.minute, this.#spec.minute, 0, 59) &&
      this.matchesRule(dt.hour, this.#spec.hour, 0, 23) &&
      this.matchesRule(dt.day, this.#spec.dayOfMonth, 1, 31) &&
      this.matchesRule(dt.month, this.#spec.month, 1, 12) &&
      this.matchesRule(
        dt.dayOfWeek === 7 ? 0 : dt.dayOfWeek,
        this.#spec.dayOfWeek,
        0,
        7,
      ) &&
      this.matchesRule(dt.year, this.#spec.year, 1970, 3000)
    );
  }

  private matchesRule(
    value: number,
    rule: Rule,
    min: number,
    max: number,
  ): boolean {
    if ("any" in rule) {
      return true;
    }

    if ("value" in rule) {
      return value === rule.value || (rule.value === 7 && value === 0);
    }

    if ("rangeValues" in rule) {
      return value >= rule.rangeValues.start && value <= rule.rangeValues.end;
    }

    if ("stepValues" in rule) {
      const { start, end, step } = rule.stepValues;
      if (value < start || value > end) return false;
      return (value - start) % step === 0;
    }

    if ("listValues" in rule) {
      return rule.listValues.some((subRule) =>
        this.matchesRule(value, subRule, min, max),
      );
    }

    return false;
  }

  private getNextCandidate(
    current: Temporal.PlainDateTime,
  ): Temporal.PlainDateTime {
    // Try next minute first
    return current.add({ minutes: 1 });
  }

  static parseSpec(rule: string): Spec {
    const trimmed = rule.trim();

    // Handle special expressions
    if (trimmed.startsWith("@")) {
      return Cron.parseSpecialExpression(trimmed);
    }

    // Parse standard cron expression
    const parts = trimmed.split(/\s+/);

    if (parts.length < 5 || parts.length > 6) {
      throw new Error(
        `Invalid cron expression: expected 5 or 6 fields, got ${parts.length}`,
      );
    }

    const [
      minutePart,
      hourPart,
      dayOfMonthPart,
      monthPart,
      dayOfWeekPart,
      yearPart,
    ] = parts;

    if (
      !minutePart ||
      !hourPart ||
      !dayOfMonthPart ||
      !monthPart ||
      !dayOfWeekPart
    ) {
      throw new Error("Invalid cron expression: missing required fields");
    }

    return {
      minute: Cron.parseField(minutePart, 0, 59),
      hour: Cron.parseField(hourPart, 0, 23),
      dayOfMonth: Cron.parseField(dayOfMonthPart, 1, 31),
      month: Cron.parseField(monthPart, 1, 12, Cron.MONTH_NAMES),
      dayOfWeek: Cron.parseField(dayOfWeekPart, 0, 7, Cron.DAY_NAMES),
      year: yearPart ? Cron.parseField(yearPart, 1970, 3000) : { any: true },
    };
  }

  private static readonly MONTH_NAMES: Record<string, number> = {
    jan: 1,
    feb: 2,
    mar: 3,
    apr: 4,
    may: 5,
    jun: 6,
    jul: 7,
    aug: 8,
    sep: 9,
    oct: 10,
    nov: 11,
    dec: 12,
  };

  private static readonly DAY_NAMES: Record<string, number> = {
    sun: 0,
    mon: 1,
    tue: 2,
    wed: 3,
    thu: 4,
    fri: 5,
    sat: 6,
  };

  private static parseSpecialExpression(expr: string): Spec {
    switch (expr.toLowerCase()) {
      case "@yearly":
      case "@annually":
        return {
          minute: { value: 0 },
          hour: { value: 0 },
          dayOfMonth: { value: 1 },
          month: { value: 1 },
          dayOfWeek: { any: true },
          year: { any: true },
        };
      case "@monthly":
        return {
          minute: { value: 0 },
          hour: { value: 0 },
          dayOfMonth: { value: 1 },
          month: { any: true },
          dayOfWeek: { any: true },
          year: { any: true },
        };
      case "@weekly":
        return {
          minute: { value: 0 },
          hour: { value: 0 },
          dayOfMonth: { any: true },
          month: { any: true },
          dayOfWeek: { value: 0 },
          year: { any: true },
        };
      case "@daily":
      case "@midnight":
        return {
          minute: { value: 0 },
          hour: { value: 0 },
          dayOfMonth: { any: true },
          month: { any: true },
          dayOfWeek: { any: true },
          year: { any: true },
        };
      case "@hourly":
        return {
          minute: { value: 0 },
          hour: { any: true },
          dayOfMonth: { any: true },
          month: { any: true },
          dayOfWeek: { any: true },
          year: { any: true },
        };
      case "@reboot":
        return { "@special": "reboot" };
      default:
        throw new Error(`Unknown special expression: ${expr}`);
    }
  }

  private static parseField(
    field: string,
    min: number,
    max: number,
    nameMap?: Record<string, number>,
  ): Rule {
    // Handle asterisk
    if (field === "*") {
      return { any: true };
    }

    // Handle lists (comma-separated)
    if (field.includes(",")) {
      const parts = field.split(",");
      const listValues = parts.map((part) =>
        Cron.parseFieldPart(part, min, max, nameMap),
      );
      return { listValues };
    }

    // Handle single part
    return Cron.parseFieldPart(field, min, max, nameMap);
  }

  private static parseFieldPart(
    part: string,
    min: number,
    max: number,
    nameMap?: Record<string, number>,
  ): RangeValues | StepValues | ValueRule {
    // Handle step values (e.g., "2/2" or "2-4/2" or "*/2")
    if (part.includes("/")) {
      const [rangePart, stepPart] = part.split("/");

      if (!rangePart || !stepPart) {
        throw new Error(`Invalid step expression: ${part}`);
      }

      const step = parseInt(stepPart, 10);

      if (rangePart === "*") {
        return {
          stepValues: {
            start: min,
            end: max,
            step,
          },
        };
      }

      if (rangePart.includes("-")) {
        const [startStr, endStr] = rangePart.split("-");

        if (!startStr || !endStr) {
          throw new Error(`Invalid range in step expression: ${part}`);
        }

        const start = Cron.parseValue(startStr, nameMap);
        const end = Cron.parseValue(endStr, nameMap);
        return {
          stepValues: {
            start,
            end,
            step,
          },
        };
      }

      const start = Cron.parseValue(rangePart, nameMap);
      return {
        stepValues: {
          start,
          end: max,
          step,
        },
      };
    }

    // Handle range values (e.g., "2-3")
    if (part.includes("-")) {
      const [startStr, endStr] = part.split("-");

      if (!startStr || !endStr) {
        throw new Error(`Invalid range expression: ${part}`);
      }

      const start = Cron.parseValue(startStr, nameMap);
      const end = Cron.parseValue(endStr, nameMap);
      return {
        rangeValues: {
          start,
          end,
        },
      };
    }

    // Handle single value
    const value = Cron.parseValue(part, nameMap);
    return { value };
  }

  private static parseValue(
    str: string,
    nameMap?: Record<string, number>,
  ): number {
    // Try to parse as name first
    if (nameMap) {
      const lower = str.toLowerCase();
      const nameValue = nameMap[lower];
      if (nameValue !== undefined) {
        return nameValue;
      }
    }

    // Parse as number
    const num = parseInt(str, 10);
    if (isNaN(num)) {
      throw new Error(`Invalid value: ${str}`);
    }
    return num;
  }
}
