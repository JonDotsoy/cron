import { test, expect } from "@playwright/test";

test("should change cron expression when clicking random button", async ({
  page,
}) => {
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

test("should load cron expression and locale from URL hash", async ({
  page,
}) => {
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

test("should load danger mode from URL hash", async ({ page }) => {
  await page.goto(
    "http://localhost:4321/#locale=es&damagemode=danger&cron=18%2C20%2C58+19+10+9+4+*%2F2",
  );
  const dangerMode = await page.getByTestId("danger-mode").inputValue();
  expect(dangerMode).toEqual("on");
});

test("should update URL hash when toggling danger mode", async ({ page }) => {
  await page.goto("http://localhost:4321/");
  await page.getByTestId("danger-mode").click();
  await page.waitForTimeout(100);
  const url = page.url();
  expect(url).toContain("damagemode=danger");
});

test("should update URL hash when changing cron expression", async ({
  page,
}) => {
  await page.goto("http://localhost:4321/");
  const input = page.getByTestId("input-cron-expression");
  await input.fill("37,33 15-20 17,22 7,9 * 2025,2027");
  await input.blur();
  await page.waitForTimeout(100);
  const url = page.url();
  expect(url).toContain("cron=37%2C33+15-20+17%2C22+7%2C9+*+2025%2C2027");
  await input.fill("* 13 22 3,10 4 2024,2025,2026");
  await input.blur();
  await page.waitForTimeout(100);
  const url2 = page.url();
  expect(url2).toContain("cron=*+13+22+3%2C10+4+2024%2C2025%2C2026");
});

test("should update code-1 element when cron expression changes", async ({
  page,
}) => {
  await page.goto("http://localhost:4321/");
  const codeElement = page.getByTestId("code-1");
  await codeElement.isVisible();
  const initialCode = await codeElement.textContent();
  const input = page.getByTestId("input-cron-expression");
  await input.fill("0 12 * * 1");
  await input.blur();
  await page.waitForTimeout(100);
  const secondCode = await codeElement.textContent();
  expect(initialCode).not.toEqual(secondCode);
  await input.fill("30 8 15 * *");
  await input.blur();
  await page.waitForTimeout(100);
  const thirdCode = await codeElement.textContent();
  expect(secondCode).not.toEqual(thirdCode);
  expect(initialCode).not.toEqual(thirdCode);
});

test("should update URL hash multiple times when changing cron expression", async ({
  page,
}) => {
  await page.goto("http://localhost:4321/");
  const input = page.getByTestId("input-cron-expression");
  const initialUrl = page.url();
  await input.clear();
  await input.pressSequentially("0 9 * * 5", { delay: 10 });
  await page.waitForTimeout(400);
  const firstUrl = page.url();
  expect(firstUrl).not.toEqual(initialUrl);
  expect(firstUrl).toContain("cron=0+9+*+*+5");
  await input.clear();
  await input.pressSequentially("15 14 1 * *", { delay: 10 });
  await page.waitForTimeout(400);
  const secondUrl = page.url();
  expect(secondUrl).not.toEqual(firstUrl);
  expect(secondUrl).toContain("cron=15+14+1+*+*");
});

test("should not contain template placeholders in code", async ({ page }) => {
  await page.goto("http://localhost:4321/");
  const codeElement = page.getByTestId("code-1");
  await codeElement.isVisible();
  const codeText = await codeElement.textContent();
  expect(codeText).not.toContain("{{locale}}");
  expect(codeText).not.toContain("{{cron-formated}}");
});
