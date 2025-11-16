import { describe, expect, it, beforeEach } from "bun:test";
import { CronFormat } from "./cron-format";
import { Cron } from "./cron";

describe("CronFormat", () => {
  let formatterEn: CronFormat;

  beforeEach(() => {
    formatterEn = new CronFormat("en");
  });

  it('formatea "* * * * *" como "At every minute."', () => {
    const cron = "* * * * *";
    const expected = "At every minute.";
    expect(formatterEn.format(cron)).toBe(expected);
  });

  it('formatea "5 4 * * *" como "At 04:05."', () => {
    const cron = "5 4 * * *";
    const expected = "At 04:05.";
    expect(formatterEn.format(cron)).toBe(expected);
  });

  it('formatea "5 4 * 6/4 *" como "At 04:05 in every 4th month from June through December."', () => {
    const cron = "5 4 * 6/4 *";
    const expected = "At 04:05 in every 4th month from June through December.";
    expect(formatterEn.format(cron)).toBe(expected);
  });

  it(
    'formatea "* 4 * 4,6/4 *" como ' +
      '"At every minute past hour 4 in April and every 4th month from June through December."',
    () => {
      const cron = "* 4 * 4,6/4 *";
      const expected =
        "At every minute past hour 4 in April and every 4th month from June through December.";
      expect(formatterEn.format(cron)).toBe(expected);
    },
  );

  it('formatea "4 * 7 * *" como "At every minute past hour 4 in July."', () => {
    const cron = "4 * 7 * *";
    const expected = "At every minute past hour 4 in July.";
    expect(formatterEn.format(cron)).toBe(expected);
  });

  it("acepta una instancia de Cron como parámetro", () => {
    const cronInstance = new Cron("* * * * *");
    const expected = "At every minute.";
    expect(formatterEn.format(cronInstance)).toBe(expected);
  });

  it("acepta una instancia de Cron con expresión compleja", () => {
    const cronInstance = new Cron("5 4 * 6/4 *");
    const expected = "At 04:05 in every 4th month from June through December.";
    expect(formatterEn.format(cronInstance)).toBe(expected);
  });
});
