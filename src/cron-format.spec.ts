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

  it('formatea "2-7 4 5,7 4,6/4 5,3" como expresión compleja', () => {
    const cron = "2-7 4 5,7 4,6/4 5,3";
    const expected =
      "At every minute from 2 through 7past hour 4 on day-of-month 5 and 7 and on Friday and Wednesday in April and every 4th month from June through December.";
    expect(formatterEn.format(cron)).toBe(expected);
  });

  it('formatea "0 22 * * 1-5" como "At 22:00 on every day-of-week from Monday through Friday."', () => {
    const cron = "0 22 * * 1-5";
    const expected =
      "At 22:00 on every day-of-week from Monday through Friday.";
    expect(formatterEn.format(cron)).toBe(expected);
  });

  it('formatea "15 14 1 * *" como "At 14:15 on day-of-month 1."', () => {
    const cron = "15 14 1 * *";
    const expected = "At 14:15 on day-of-month 1.";
    expect(formatterEn.format(cron)).toBe(expected);
  });

  it('formatea "5 0 * 8 *" como "At 00:05 in August."', () => {
    const cron = "5 0 * 8 *";
    const expected = "At 00:05 in August.";
    expect(formatterEn.format(cron)).toBe(expected);
  });

  it('formatea "@weekly" como "At 00:00 on Sunday."', () => {
    const cron = "@weekly";
    const expected = "At 00:00 on Sunday.";
    expect(formatterEn.format(cron)).toBe(expected);
  });

  it('formatea "0 0 1,15 * 3" como "At 00:00 on day-of-month 1 and 15 and on Wednesday."', () => {
    const cron = "0 0 1,15 * 3";
    const expected = "At 00:00 on day-of-month 1 and 15 and on Wednesday.";
    expect(formatterEn.format(cron)).toBe(expected);
  });

  it('formatea "0 4 8-14 * *" como "At 04:00 on every day-of-month from 8 through 14."', () => {
    const cron = "0 4 8-14 * *";
    const expected = "At 04:00 on every day-of-month from 8 through 14.";
    expect(formatterEn.format(cron)).toBe(expected);
  });

  it('formatea "0 0,12 1 */2 *" como "At minute 0 past hour 0 and 12 on day-of-month 1 in every 2nd month."', () => {
    const cron = "0 0,12 1 */2 *";
    const expected =
      "At minute 0 past hour 0 and 12 on day-of-month 1 in every 2nd month.";
    expect(formatterEn.format(cron)).toBe(expected);
  });

  it('formatea "5 4 * * sun" como "At 04:05 on Sunday."', () => {
    const cron = "5 4 * * sun";
    const expected = "At 04:05 on Sunday.";
    expect(formatterEn.format(cron)).toBe(expected);
  });
});
