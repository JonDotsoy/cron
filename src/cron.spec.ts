import {
  afterAll,
  beforeAll,
  describe,
  expect,
  mock,
  setSystemTime,
  spyOn,
  test,
} from "bun:test";
import { Cron } from "./cron";
import { Temporal } from "temporal-polyfill";

const take = <T>(iterator: Iterable<T>, limit: number = Infinity) => {
  const list: T[] = [];
  for (const item of iterator) {
    list.push(item);
    if (list.length >= limit) {
      break;
    }
  }
  return list;
};

describe("Cron", () => {
  beforeAll(() => {
    setSystemTime(new Date("2025-11-14T19:06:33.669Z"));
  });

  afterAll(() => {
    setSystemTime(undefined);
  });

  test("should parse step values (every 2nd minute from 2 through 59)", () => {
    // At every 2nd minute from 2 through 59
    const cron = new Cron("2/2 * * * *");

    expect(cron.spec).toEqual({
      minute: {
        stepValues: {
          start: 2,
          end: 59,
          step: 2,
        },
      },
      hour: { any: true },
      dayOfMonth: { any: true },
      month: { any: true },
      dayOfWeek: { any: true },
      year: { any: true },
    });
  });

  test("should parse special expressions (@yearly, @monthly, @weekly, etc.)", () => {
    expect(new Cron("@yearly").spec).toEqual({
      minute: { value: 0 },
      hour: { value: 0 },
      dayOfMonth: { value: 1 },
      month: { value: 1 },
      dayOfWeek: { any: true },
      year: { any: true },
    });
    expect(new Cron("@annually").spec).toEqual({
      minute: { value: 0 },
      hour: { value: 0 },
      dayOfMonth: { value: 1 },
      month: { value: 1 },
      dayOfWeek: { any: true },
      year: { any: true },
    });

    expect(new Cron("@monthly").spec).toEqual({
      minute: { value: 0 },
      hour: { value: 0 },
      dayOfMonth: { value: 1 },
      month: { any: true },
      dayOfWeek: { any: true },
      year: { any: true },
    });

    expect(new Cron("@weekly").spec).toEqual({
      minute: { value: 0 },
      hour: { value: 0 },
      dayOfMonth: { any: true },
      month: { any: true },
      dayOfWeek: { value: 0 },
      year: { any: true },
    });

    expect(new Cron("@daily").spec).toEqual({
      minute: { value: 0 },
      hour: { value: 0 },
      dayOfMonth: { any: true },
      month: { any: true },
      dayOfWeek: { any: true },
      year: { any: true },
    });

    expect(new Cron("@hourly").spec).toEqual({
      minute: { value: 0 },
      hour: { any: true },
      dayOfMonth: { any: true },
      month: { any: true },
      dayOfWeek: { any: true },
      year: { any: true },
    });

    expect(new Cron("@reboot").spec).toEqual({
      "@special": "reboot",
    });
  });

  test("should parse asterisk with specific hour", () => {
    const cron = new Cron("* 2 * * *");

    expect(cron.spec).toEqual({
      minute: { any: true },
      hour: { value: 2 },
      dayOfMonth: { any: true },
      month: { any: true },
      dayOfWeek: { any: true },
      year: { any: true },
    });
  });

  test("should parse specific values in different positions (day, month, dayOfWeek)", () => {
    const cron1 = new Cron("* * 2 * *");
    expect(cron1.spec).toEqual({
      minute: { any: true },
      hour: { any: true },
      dayOfMonth: { value: 2 },
      month: { any: true },
      dayOfWeek: { any: true },
      year: { any: true },
    });

    const cron2 = new Cron("* * * 2 *");
    expect(cron2.spec).toEqual({
      minute: { any: true },
      hour: { any: true },
      dayOfMonth: { any: true },
      month: { value: 2 },
      dayOfWeek: { any: true },
      year: { any: true },
    });

    const cron3 = new Cron("* * * * 2");
    expect(cron3.spec).toEqual({
      minute: { any: true },
      hour: { any: true },
      dayOfMonth: { any: true },
      month: { any: true },
      dayOfWeek: { value: 2 },
      year: { any: true },
    });
  });

  test("should parse range values (2-3) in each segment", () => {
    const cron1 = new Cron("* * 2-3 * *");
    expect(cron1.spec).toEqual({
      minute: { any: true },
      hour: { any: true },
      dayOfMonth: {
        rangeValues: {
          start: 2,
          end: 3,
        },
      },
      month: { any: true },
      dayOfWeek: { any: true },
      year: { any: true },
    });

    const cron2 = new Cron("2-3 * * * *");
    expect(cron2.spec).toEqual({
      minute: {
        rangeValues: {
          start: 2,
          end: 3,
        },
      },
      hour: { any: true },
      dayOfMonth: { any: true },
      month: { any: true },
      dayOfWeek: { any: true },
      year: { any: true },
    });

    const cron3 = new Cron("* 2-3 * * *");
    expect(cron3.spec).toEqual({
      minute: { any: true },
      hour: {
        rangeValues: {
          start: 2,
          end: 3,
        },
      },
      dayOfMonth: { any: true },
      month: { any: true },
      dayOfWeek: { any: true },
      year: { any: true },
    });

    const cron4 = new Cron("* * * 2-3 *");
    expect(cron4.spec).toEqual({
      minute: { any: true },
      hour: { any: true },
      dayOfMonth: { any: true },
      month: {
        rangeValues: {
          start: 2,
          end: 3,
        },
      },
      dayOfWeek: { any: true },
      year: { any: true },
    });

    const cron5 = new Cron("* * * * 2-3");
    expect(cron5.spec).toEqual({
      minute: { any: true },
      hour: { any: true },
      dayOfMonth: { any: true },
      month: { any: true },
      dayOfWeek: {
        rangeValues: {
          start: 2,
          end: 3,
        },
      },
      year: { any: true },
    });
  });

  test("should parse list with range and value (2-3,3)", () => {
    const cron = new Cron("* * 2-3,3 * *");
    expect(cron.spec).toEqual({
      minute: { any: true },
      hour: { any: true },
      dayOfMonth: {
        listValues: [
          {
            rangeValues: {
              start: 2,
              end: 3,
            },
          },
          { value: 3 },
        ],
      },
      month: { any: true },
      dayOfWeek: { any: true },
      year: { any: true },
    });
  });

  test("should parse list with range and step values (2-3,3/2)", () => {
    const cron = new Cron("* * 2-3,3/2 * *");
    expect(cron.spec).toEqual({
      minute: { any: true },
      hour: { any: true },
      dayOfMonth: {
        listValues: [
          {
            rangeValues: {
              start: 2,
              end: 3,
            },
          },
          {
            stepValues: {
              start: 3,
              end: 31,
              step: 2,
            },
          },
        ],
      },
      month: { any: true },
      dayOfWeek: { any: true },
      year: { any: true },
    });
  });

  // Case: At every minute on every day-of-month from 2 through 3 and every 2nd day-of-month from 3 through 4.
  // Cron: * * 2-3,3-4/2 * *
  test("should parse list with range and range-step values (2-3,3-4/2)", () => {
    const cron = new Cron("* * 2-3,3-4/2 * *");
    expect(cron.spec).toEqual({
      minute: { any: true },
      hour: { any: true },
      dayOfMonth: {
        listValues: [
          {
            rangeValues: {
              start: 2,
              end: 3,
            },
          },
          {
            stepValues: {
              start: 3,
              end: 4,
              step: 2,
            },
          },
        ],
      },
      month: { any: true },
      dayOfWeek: { any: true },
      year: { any: true },
    });
  });

  test("should parse Sunday as day 7", () => {
    const cron = new Cron("* * * * 7");
    expect(cron.spec).toEqual({
      minute: { any: true },
      hour: { any: true },
      dayOfMonth: { any: true },
      month: { any: true },
      dayOfWeek: { value: 7 },
      year: { any: true },
    });
  });

  // CASE: At every minute in June.
  // CRON: * * * JUN *
  test("should parse month name in uppercase (JUN)", () => {
    const cron = new Cron("* * * JUN *");
    expect(cron.spec).toEqual({
      minute: { any: true },
      hour: { any: true },
      dayOfMonth: { any: true },
      month: { value: 6 },
      dayOfWeek: { any: true },
      year: { any: true },
    });
  });

  // CASE: At every minute in June.
  // CRON: * * * jun *
  test("should parse month name in lowercase (jun)", () => {
    const cron = new Cron("* * * jun *");
    expect(cron.spec).toEqual({
      minute: { any: true },
      hour: { any: true },
      dayOfMonth: { any: true },
      month: { value: 6 },
      dayOfWeek: { any: true },
      year: { any: true },
    });
  });

  // CASE: At every minute in June.
  // CRON: * * * 6 *
  test("should parse month as number (6)", () => {
    const cron = new Cron("* * * 6 *");
    expect(cron.spec).toEqual({
      minute: { any: true },
      hour: { any: true },
      dayOfMonth: { any: true },
      month: { value: 6 },
      dayOfWeek: { any: true },
      year: { any: true },
    });
  });

  // CASE: At every minute in every month from June through August.
  // CRON: * * * jun-aug *
  test("should parse month range with names (jun-aug)", () => {
    const cron = new Cron("* * * jun-aug *");
    expect(cron.spec).toEqual({
      minute: { any: true },
      hour: { any: true },
      dayOfMonth: { any: true },
      month: {
        rangeValues: {
          start: 6,
          end: 8,
        },
      },
      dayOfWeek: { any: true },
      year: { any: true },
    });
  });

  // CASE: At every minute in every month from June through August and January.
  // CRON: * * * jun-aug,jan *
  test("should parse month list with range and name (jun-aug,jan)", () => {
    const cron = new Cron("* * * jun-aug,jan *");
    expect(cron.spec).toEqual({
      minute: { any: true },
      hour: { any: true },
      dayOfMonth: { any: true },
      month: {
        listValues: [
          {
            rangeValues: {
              start: 6,
              end: 8,
            },
          },
          { value: 1 },
        ],
      },
      dayOfWeek: { any: true },
      year: { any: true },
    });
  });

  // CASE: At every minute in every month from June through August, January, and every month from June through December.
  // CRON: * * * jun-aug,jan,6-12 *
  test("should parse complex month list (jun-aug,jan,6-12)", () => {
    const cron = new Cron("* * * jun-aug,jan,6-12 *");
    expect(cron.spec).toEqual({
      minute: { any: true },
      hour: { any: true },
      dayOfMonth: { any: true },
      month: {
        listValues: [
          {
            rangeValues: {
              start: 6,
              end: 8,
            },
          },
          { value: 1 },
          {
            rangeValues: {
              start: 6,
              end: 12,
            },
          },
        ],
      },
      dayOfWeek: { any: true },
      year: { any: true },
    });
  });

  // CASE: At every minute on Monday.
  // CRON: * * * * mon
  test("should parse day of week name (mon)", () => {
    const cron = new Cron("* * * * mon");
    expect(cron.spec).toEqual({
      minute: { any: true },
      hour: { any: true },
      dayOfMonth: { any: true },
      month: { any: true },
      dayOfWeek: { value: 1 },
      year: { any: true },
    });
  });

  // CASE: At every minute on every day-of-week from Monday through Tuesday.
  // CRON: * * * * mon-tue
  test("should parse day of week range with names (mon-tue)", () => {
    const cron = new Cron("* * * * mon-tue");
    expect(cron.spec).toEqual({
      minute: { any: true },
      hour: { any: true },
      dayOfMonth: { any: true },
      month: { any: true },
      dayOfWeek: {
        rangeValues: {
          start: 1,
          end: 2,
        },
      },
      year: { any: true },
    });
  });

  // CASE: At every minute on Sunday.
  // CRON: * * * * 0
  test("should parse Sunday as day 0", () => {
    const cron = new Cron("* * * * 0");
    expect(cron.spec).toEqual({
      minute: { any: true },
      hour: { any: true },
      dayOfMonth: { any: true },
      month: { any: true },
      dayOfWeek: { value: 0 },
      year: { any: true },
    });
  });

  test("should parse specific year (2025)", () => {
    const cron = new Cron("* * * * * 2025");
    expect(cron.spec).toEqual({
      minute: { any: true },
      hour: { any: true },
      dayOfMonth: { any: true },
      month: { any: true },
      dayOfWeek: { any: true },
      year: { value: 2025 },
    });
  });

  test("should generate correct dates for @yearly expression", () => {
    const cron = new Cron("@yearly");

    const list = take(cron, 4);

    const f = list.map((item) => ({
      year: item.year,
      month: item.month,
      day: item.day,
      hour: item.hour,
      minute: item.minute,
      second: item.second,
    }));

    // next at 2026-01-01 00:00:00
    // then at 2027-01-01 00:00:00
    // then at 2028-01-01 00:00:00
    // then at 2029-01-01 00:00:00
    expect(f).toEqual([
      { year: 2026, month: 1, day: 1, hour: 0, minute: 0, second: 0 },
      { year: 2027, month: 1, day: 1, hour: 0, minute: 0, second: 0 },
      { year: 2028, month: 1, day: 1, hour: 0, minute: 0, second: 0 },
      { year: 2029, month: 1, day: 1, hour: 0, minute: 0, second: 0 },
    ]);
  });

  test("should generate correct dates for every minute (* * * * *)", () => {
    const cron = new Cron("* * * * *");

    const list = take(cron, 5);

    const f = list.map((item) => ({
      year: item.year,
      month: item.month,
      day: item.day,
      hour: item.hour,
      minute: item.minute,
      second: item.second,
    }));

    // System time is 2025-11-14T19:06:33.669Z (16:06:33 local time GMT-3)
    // next at 2025-11-14 19:07:00 UTC (16:07:00 local)
    // then at 2025-11-14 19:08:00 UTC (16:08:00 local)
    // then at 2025-11-14 19:09:00 UTC (16:09:00 local)
    // then at 2025-11-14 19:10:00 UTC (16:10:00 local)
    // then at 2025-11-14 19:11:00 UTC (16:11:00 local)
    expect(f).toEqual([
      { year: 2025, month: 11, day: 14, hour: 19, minute: 7, second: 0 },
      { year: 2025, month: 11, day: 14, hour: 19, minute: 8, second: 0 },
      { year: 2025, month: 11, day: 14, hour: 19, minute: 9, second: 0 },
      { year: 2025, month: 11, day: 14, hour: 19, minute: 10, second: 0 },
      { year: 2025, month: 11, day: 14, hour: 19, minute: 11, second: 0 },
    ]);
  });

  // CASE: At minute 1.
  // CRON: 1 * * * *
  // next at 2025-11-14 18:01:00
  // then at 2025-11-14 19:01:00
  // then at 2025-11-14 20:01:00
  // then at 2025-11-14 21:01:00
  // then at 2025-11-14 22:01:00
  test("should generate correct dates for 'At minute 1' (1 * * * *)", () => {
    const cron = new Cron("1 * * * *");

    const list = take(cron, 5);

    const f = list.map((item) => ({
      year: item.year,
      month: item.month,
      day: item.day,
      hour: item.hour,
      minute: item.minute,
      second: item.second,
    }));

    expect(f).toEqual([
      { year: 2025, month: 11, day: 14, hour: 20, minute: 1, second: 0 },
      { year: 2025, month: 11, day: 14, hour: 21, minute: 1, second: 0 },
      { year: 2025, month: 11, day: 14, hour: 22, minute: 1, second: 0 },
      { year: 2025, month: 11, day: 14, hour: 23, minute: 1, second: 0 },
      { year: 2025, month: 11, day: 15, hour: 0, minute: 1, second: 0 },
    ]);
  });

  // CASE: At every minute past hour 1.
  // CRON: * 1 * * *
  // next at 2025-11-15 01:00:00
  // then at 2025-11-15 01:01:00
  // then at 2025-11-15 01:02:00
  // then at 2025-11-15 01:03:00
  // then at 2025-11-15 01:04:00
  test("should generate correct dates for 'At every minute past hour 1' (* 1 * * *)", () => {
    const cron = new Cron("* 1 * * *");

    const list = take(cron, 5);

    const f = list.map((item) => ({
      year: item.year,
      month: item.month,
      day: item.day,
      hour: item.hour,
      minute: item.minute,
      second: item.second,
    }));

    expect(f).toEqual([
      { year: 2025, month: 11, day: 15, hour: 1, minute: 0, second: 0 },
      { year: 2025, month: 11, day: 15, hour: 1, minute: 1, second: 0 },
      { year: 2025, month: 11, day: 15, hour: 1, minute: 2, second: 0 },
      { year: 2025, month: 11, day: 15, hour: 1, minute: 3, second: 0 },
      { year: 2025, month: 11, day: 15, hour: 1, minute: 4, second: 0 },
    ]);
  });

  // CASE: At every minute on day-of-month 1.
  // CRON: * * 1 * *
  // next at 2025-12-01 00:00:00
  // then at 2025-12-01 00:01:00
  // then at 2025-12-01 00:02:00
  // then at 2025-12-01 00:03:00
  // then at 2025-12-01 00:04:00
  test("should generate correct dates for 'At every minute on day-of-month 1' (* * 1 * *)", () => {
    const cron = new Cron("* * 1 * *");

    const list = take(cron, 5);

    const f = list.map((item) => ({
      year: item.year,
      month: item.month,
      day: item.day,
      hour: item.hour,
      minute: item.minute,
      second: item.second,
    }));

    expect(f).toEqual([
      { year: 2025, month: 12, day: 1, hour: 0, minute: 0, second: 0 },
      { year: 2025, month: 12, day: 1, hour: 0, minute: 1, second: 0 },
      { year: 2025, month: 12, day: 1, hour: 0, minute: 2, second: 0 },
      { year: 2025, month: 12, day: 1, hour: 0, minute: 3, second: 0 },
      { year: 2025, month: 12, day: 1, hour: 0, minute: 4, second: 0 },
    ]);
  });

  // CASE: At every minute in January.
  // CRON: * * * 1 *
  // next at 2026-01-01 00:00:00
  // then at 2026-01-01 00:01:00
  // then at 2026-01-01 00:02:00
  // then at 2026-01-01 00:03:00
  // then at 2026-01-01 00:04:00
  test("should generate correct dates for 'At every minute in January' (* * * 1 *)", () => {
    const cron = new Cron("* * * 1 *");

    const list = take(cron, 5);

    const f = list.map((item) => ({
      year: item.year,
      month: item.month,
      day: item.day,
      hour: item.hour,
      minute: item.minute,
      second: item.second,
    }));

    expect(f).toEqual([
      { year: 2026, month: 1, day: 1, hour: 0, minute: 0, second: 0 },
      { year: 2026, month: 1, day: 1, hour: 0, minute: 1, second: 0 },
      { year: 2026, month: 1, day: 1, hour: 0, minute: 2, second: 0 },
      { year: 2026, month: 1, day: 1, hour: 0, minute: 3, second: 0 },
      { year: 2026, month: 1, day: 1, hour: 0, minute: 4, second: 0 },
    ]);
  });

  // CASE: At every minute on Monday.
  // CRON: * * * * 1
  // next at 2025-11-17 00:00:00
  // then at 2025-11-17 00:01:00
  // then at 2025-11-17 00:02:00
  // then at 2025-11-17 00:03:00
  // then at 2025-11-17 00:04:00
  test("should generate correct dates for 'At every minute on Monday' (* * * * 1)", () => {
    const cron = new Cron("* * * * 1");

    const list = take(cron, 5);

    const f = list.map((item) => ({
      year: item.year,
      month: item.month,
      day: item.day,
      hour: item.hour,
      minute: item.minute,
      second: item.second,
    }));

    expect(f).toEqual([
      { year: 2025, month: 11, day: 17, hour: 0, minute: 0, second: 0 },
      { year: 2025, month: 11, day: 17, hour: 0, minute: 1, second: 0 },
      { year: 2025, month: 11, day: 17, hour: 0, minute: 2, second: 0 },
      { year: 2025, month: 11, day: 17, hour: 0, minute: 3, second: 0 },
      { year: 2025, month: 11, day: 17, hour: 0, minute: 4, second: 0 },
    ]);
  });

  // CASE: At 22:00 on every day-of-week from Monday through Friday.
  // CRON: 0 22 * * 1-5
  // Next at 2025-11-14 22:00:00
  // then at 2025-11-17 22:00:00
  // then at 2025-11-18 22:00:00
  // then at 2025-11-19 22:00:00
  // then at 2025-11-20 22:00:00
  test("should generate correct dates for 'At 22:00 on every day-of-week from Monday through Friday' (0 22 * * 1-5)", () => {
    const cron = new Cron("0 22 * * 1-5");

    const list = take(cron, 5);

    const f = list.map((item) => ({
      year: item.year,
      month: item.month,
      day: item.day,
      hour: item.hour,
      minute: item.minute,
      second: item.second,
    }));

    expect(f).toEqual([
      { year: 2025, month: 11, day: 14, hour: 22, minute: 0, second: 0 },
      { year: 2025, month: 11, day: 17, hour: 22, minute: 0, second: 0 },
      { year: 2025, month: 11, day: 18, hour: 22, minute: 0, second: 0 },
      { year: 2025, month: 11, day: 19, hour: 22, minute: 0, second: 0 },
      { year: 2025, month: 11, day: 20, hour: 22, minute: 0, second: 0 },
    ]);
  });

  // CASE: At minute 23 past every 2nd hour from 0 through 20.
  // CRON: 23 0-20/2 * * *
  // Next at 2025-11-14 18:23:00
  // then at 2025-11-14 20:23:00
  // then at 2025-11-15 00:23:00
  // then at 2025-11-15 02:23:00
  // then at 2025-11-15 04:23:00
  test("should generate correct dates for 'At minute 23 past every 2nd hour from 0 through 20' (23 0-20/2 * * *)", () => {
    const cron = new Cron("23 0-20/2 * * *");

    const list = take(cron, 5);

    const f = list.map((item) => ({
      year: item.year,
      month: item.month,
      day: item.day,
      hour: item.hour,
      minute: item.minute,
      second: item.second,
    }));

    expect(f).toEqual([
      { year: 2025, month: 11, day: 14, hour: 20, minute: 23, second: 0 },
      { year: 2025, month: 11, day: 15, hour: 0, minute: 23, second: 0 },
      { year: 2025, month: 11, day: 15, hour: 2, minute: 23, second: 0 },
      { year: 2025, month: 11, day: 15, hour: 4, minute: 23, second: 0 },
      { year: 2025, month: 11, day: 15, hour: 6, minute: 23, second: 0 },
    ]);
  });

  // CASE: At 04:05 on Sunday.
  // CRON: 5 4 * * sun
  // Next at 2025-11-16 04:05:00
  // then at 2025-11-23 04:05:00
  // then at 2025-11-30 04:05:00
  // then at 2025-12-07 04:05:00
  // then at 2025-12-14 04:05:00
  test("should generate correct dates for 'At 04:05 on Sunday' (5 4 * * sun)", () => {
    const cron = new Cron("5 4 * * sun");

    const list = take(cron, 5);

    const f = list.map((item) => ({
      year: item.year,
      month: item.month,
      day: item.day,
      hour: item.hour,
      minute: item.minute,
      second: item.second,
    }));

    expect(f).toEqual([
      { year: 2025, month: 11, day: 16, hour: 4, minute: 5, second: 0 },
      { year: 2025, month: 11, day: 23, hour: 4, minute: 5, second: 0 },
      { year: 2025, month: 11, day: 30, hour: 4, minute: 5, second: 0 },
      { year: 2025, month: 12, day: 7, hour: 4, minute: 5, second: 0 },
      { year: 2025, month: 12, day: 14, hour: 4, minute: 5, second: 0 },
    ]);
  });

  // CASE: At minute 0 past hour 0 and 12 on day-of-month 1 in every 2nd month.
  // CRON: 0 0,12 1 */2 *
  // Next at 2026-01-01 00:00:00
  // then at 2026-01-01 12:00:00
  // then at 2026-03-01 00:00:00
  // then at 2026-03-01 12:00:00
  // then at 2026-05-01 00:00:00
  test("should generate correct dates for 'At minute 0 past hour 0 and 12 on day-of-month 1 in every 2nd month' (0 0,12 1 */2 *)", () => {
    const cron = new Cron("0 0,12 1 */2 *");

    const list = take(cron, 5);

    const f = list.map((item) => ({
      year: item.year,
      month: item.month,
      day: item.day,
      hour: item.hour,
      minute: item.minute,
      second: item.second,
    }));

    expect(f).toEqual([
      { year: 2026, month: 1, day: 1, hour: 0, minute: 0, second: 0 },
      { year: 2026, month: 1, day: 1, hour: 12, minute: 0, second: 0 },
      { year: 2026, month: 3, day: 1, hour: 0, minute: 0, second: 0 },
      { year: 2026, month: 3, day: 1, hour: 12, minute: 0, second: 0 },
      { year: 2026, month: 5, day: 1, hour: 0, minute: 0, second: 0 },
    ]);
  });

  // CASE: At 04:00 on every day-of-month from 8 through 14.
  // CRON: 0 4 8-14 * *
  // Next at 2025-12-08 04:00:00
  // then at 2025-12-09 04:00:00
  // then at 2025-12-10 04:00:00
  // then at 2025-12-11 04:00:00
  // then at 2025-12-12 04:00:00
  test("should generate correct dates for 'At 04:00 on every day-of-month from 8 through 14' (0 4 8-14 * *)", () => {
    const cron = new Cron("0 4 8-14 * *");

    const list = take(cron, 5);

    const f = list.map((item) => ({
      year: item.year,
      month: item.month,
      day: item.day,
      hour: item.hour,
      minute: item.minute,
      second: item.second,
    }));

    expect(f).toEqual([
      { year: 2025, month: 12, day: 8, hour: 4, minute: 0, second: 0 },
      { year: 2025, month: 12, day: 9, hour: 4, minute: 0, second: 0 },
      { year: 2025, month: 12, day: 10, hour: 4, minute: 0, second: 0 },
      { year: 2025, month: 12, day: 11, hour: 4, minute: 0, second: 0 },
      { year: 2025, month: 12, day: 12, hour: 4, minute: 0, second: 0 },
    ]);
  });
});

describe("Cron.setTimeout", () => {
  const cbs = new Set<() => any>();
  const customSetTimeout = (cb: () => void, timeout: number) => {
    const done = async () => {
      try {
        cb();
      } finally {
        cbs.delete(done);
      }
    };
    cbs.add(done);
  };
  const next = async () => {
    for (const cb of cbs) {
      cb();
    }
    await new Promise((resolve) => process.nextTick(resolve));
  };
  const mockSetTimeout = spyOn(globalThis, "setTimeout").mockImplementation(
    customSetTimeout as any,
  );

  afterAll(() => {
    setSystemTime();
    mockSetTimeout.mockRestore();
  });

  // CASE: Test createInterval with every minute cron
  // CRON: * * * * *
  test("should execute callback every minute using createInterval", async () => {
    const cron = new Cron("* * * * *");
    const executions: number[] = [];
    const delays: number[] = [];

    const currentTime = Temporal.Instant.fromEpochMilliseconds(
      new Date(2025, 11, 1, 10, 10, 10, 10).getTime(),
    );

    setSystemTime(currentTime.epochMilliseconds);

    Cron.setInterval(() => {
      executions.push(Date.now());
    }, cron);

    expect(mockSetTimeout).toBeCalledTimes(1);
    expect(mockSetTimeout).nthCalledWith(1, expect.anything(), 49990);

    setSystemTime(
      currentTime.add({ minutes: 1, seconds: 40 }).epochMilliseconds,
    );
    await next();

    expect(mockSetTimeout).toBeCalledTimes(2);
    expect(mockSetTimeout).nthCalledWith(2, expect.anything(), 9990);
  });

  // CASE: Test setInterval with @reboot expression
  // CRON: @reboot
  test("should execute callback immediately once with @reboot", async () => {
    const cron = new Cron("@reboot");
    const executions: number[] = [];

    const currentTime = Temporal.Instant.fromEpochMilliseconds(
      new Date(2025, 11, 1, 10, 10, 10, 10).getTime(),
    );

    setSystemTime(currentTime.epochMilliseconds);

    const callCountBefore = mockSetTimeout.mock.calls.length;

    const { promise } = Cron.setInterval(() => {
      executions.push(Date.now());
    }, cron);

    // Wait for the promise to resolve
    await promise;

    // Should not have called setTimeout for @reboot (no new calls)
    expect(mockSetTimeout.mock.calls.length).toBe(callCountBefore);

    // Should have executed once immediately
    expect(executions).toHaveLength(1);
    expect(executions[0]).toBe(currentTime.epochMilliseconds);
  });

  // CASE: Test using keyword with setInterval
  // CRON: * * * * *
  test("should support 'using' keyword for automatic disposal", () => {
    const cron = new Cron("* * * * *");

    const currentTime = Temporal.Instant.fromEpochMilliseconds(
      new Date(2025, 11, 1, 10, 10, 10, 10).getTime(),
    );

    setSystemTime(currentTime.epochMilliseconds);

    const cronInterval = Cron.setInterval(() => {}, cron);

    // Verify that Symbol.dispose exists and is a function
    expect(typeof cronInterval[Symbol.dispose]).toBe("function");

    // Verify that calling Symbol.dispose works (doesn't throw)
    expect(() => cronInterval[Symbol.dispose]()).not.toThrow();
  });

  // CASE: Test await using keyword with setInterval
  // CRON: @reboot (completes immediately)
  test("should support 'await using' keyword for automatic disposal", async () => {
    const cron = new Cron("@reboot");
    let callbackExecuted = false;

    const currentTime = Temporal.Instant.fromEpochMilliseconds(
      new Date(2025, 11, 1, 10, 10, 10, 10).getTime(),
    );

    setSystemTime(currentTime.epochMilliseconds);

    {
      await using cronInterval = Cron.setInterval(() => {
        callbackExecuted = true;
      }, cron);

      // Verify that Symbol.asyncDispose exists and is a function
      expect(typeof cronInterval[Symbol.asyncDispose]).toBe("function");
    }
    // At this point, Symbol.asyncDispose should have been called and awaited

    expect(callbackExecuted).toBe(true);
  });
});
