import { test, expect } from "@playwright/test";

test("blog index loads", async ({ page }) => {
  const res = await page.goto("/blog/");
  expect(res?.status()).toBe(200);

  await expect(page.getByTestId("article-row").first()).toBeVisible();

  const hrefs = await page.$$eval('[data-testid="article-row"]', (els) =>
    els
      .map((e) => e.getAttribute("href"))
      .filter((x): x is string => !!x)
  );

  expect(hrefs.length).toBeGreaterThan(0);
});

test("blog subfolder routes resolve for multiple articles", async ({ page }) => {
  const res = await page.goto("/blog/");
  expect(res?.status()).toBe(200);

  await expect(page.getByTestId("article-row").first()).toBeVisible();

  const hrefs = await page.$$eval('[data-testid="article-row"]', (els) =>
    els
      .map((e) => e.getAttribute("href"))
      .filter((x): x is string => !!x)
  );

  expect(hrefs.length).toBeGreaterThan(0);

  const max = Math.min(hrefs.length, 8);

  for (let i = 0; i < max; i++) {
    const href = hrefs[i];
    const articleRes = await page.goto(href);
    expect(articleRes?.status()).toBe(200);

    await expect(page.getByTestId("blog-content")).toBeVisible();
  }
});

test("non-existent blog route 404s", async ({ page }) => {
  const res = await page.goto("/blog/this-should-not-exist-ever/");
  expect(res?.status()).toBe(404);
});