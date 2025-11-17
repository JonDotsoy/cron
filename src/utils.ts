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

export type Spec =
  | {
      minute: Rule;
      hour: Rule;
      dayOfMonth: Rule;
      month: Rule;
      dayOfWeek: Rule;
      year: Rule;
    }
  | { "@special": "reboot" };

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomRule(min: number, max: number): Rule {
  const type = randomInt(0, 4);

  switch (type) {
    case 0: // any
      return { any: true };
    case 1: // value
      return { value: randomInt(min, max) };
    case 2: // range
      const start = randomInt(min, max - 1);
      const end = randomInt(start + 1, max);
      return { rangeValues: { start, end } };
    case 3: // step
      const step = randomInt(2, Math.min(5, max - min));
      return {
        stepValues: {
          start: min,
          end: max,
          step,
        },
      };
    case 4: // list
      const count = randomInt(2, 3);
      const listValues: (ValueRule | RangeValues)[] = [];
      for (let i = 0; i < count; i++) {
        if (Math.random() > 0.5) {
          listValues.push({ value: randomInt(min, max) });
        } else {
          const s = randomInt(min, max - 1);
          const e = randomInt(s + 1, max);
          listValues.push({ rangeValues: { start: s, end: e } });
        }
      }
      return { listValues };
    default:
      return { any: true };
  }
}

export function randomSpec(): Spec {
  // 10% chance of special expression
  if (Math.random() < 0.1) {
    return { "@special": "reboot" };
  }

  return {
    minute: randomRule(0, 59),
    hour: randomRule(0, 23),
    dayOfMonth: randomRule(1, 31),
    month: randomRule(1, 12),
    dayOfWeek: randomRule(0, 6),
    year: Math.random() > 0.8 ? randomRule(2024, 2030) : { any: true },
  };
}
