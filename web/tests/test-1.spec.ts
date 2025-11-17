import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("http://localhost:4321/");
  await page.getByTestId("input-cron-expression").isVisible();
  const initialText = await page
    .getByTestId("input-cron-expression")
    .inputValue();
  await page.getByTestId("btn-random").click();
  await page.waitForTimeout(100);
  const finalText = await page
    .getByTestId("input-cron-expression")
    .inputValue();
  expect(initialText).not.toEqual(finalText);
});

test("test1", async ({ page }) => {
  await page.goto(
    "http://localhost:4321/#locale=es&damagemode=normal&cron=18%2C20%2C58+19+10+9+4+*%2F2",
  );
  await page.getByTestId("input-cron-expression").isVisible();
  const lang = await page.getByTestId("language-selector").inputValue();
  const inputValue = await page
    .getByTestId("input-cron-expression")
    .inputValue();
  expect(inputValue).toEqual("18,20,58 19 10 9 4 */2");
  expect(lang).toEqual("es");
});

test("test2", async ({ page }) => {
  await page.goto(
    "http://localhost:4321/#locale=es&damagemode=danger&cron=18%2C20%2C58+19+10+9+4+*%2F2",
  );
  const dangerMode = await page.getByTestId("danger-mode").inputValue();
  expect(dangerMode).toEqual("on");
});

test("test3", async ({ page }) => {
  await page.goto("http://localhost:4321/");
  await page.getByTestId("danger-mode").click();
  await page.waitForTimeout(100);
  const url = page.url();
  expect(url).toContain("damagemode=danger");
});
