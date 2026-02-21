import { test, expect } from "@playwright/test";

test("every tested blog article shows related articles and excludes itself", async ({ page }) => {
  const res = await page.goto("/blog/");
  expect(res?.status()).toBe(200);

  await expect(page.getByTestId("article-row").first()).toBeVisible();

  const hrefs = await page.$$eval('[data-testid="article-row"]', (els) =>
    els
      .map((e) => e.getAttribute("href"))
      .filter((x): x is string => !!x)
  );

  expect(hrefs.length).toBeGreaterThan(0);

  const max = Math.min(hrefs.length, 6);

  for (let i = 0; i < max; i++) {
    const href = hrefs[i];

    const articleRes = await page.goto(href);
    expect(articleRes?.status()).toBe(200);

    const related = page.getByTestId("related-articles");
    await expect(related).toBeVisible();

    const relatedRows = related.locator('[data-testid="article-row"]');
    const relatedCount = await relatedRows.count();
    expect(relatedCount).toBeGreaterThan(0);

    for (let j = 0; j < relatedCount; j++) {
      const rhref = await relatedRows.nth(j).getAttribute("href");
      expect(rhref).toBeTruthy();
      expect(rhref).not.toBe(href);
    }
  }
});