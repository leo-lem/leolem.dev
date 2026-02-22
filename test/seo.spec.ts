import { test, expect } from "@playwright/test";

test("blog article has canonical, meta description, and ld+json", async ({ page }) => {
  await page.goto("/blog/");

  const first = page.locator('a[href^="/blog/"]').first();
  const href = await first.getAttribute("href");
  expect(href).toBeTruthy();

  await page.goto(href!);

  const canonical = page.locator('link[rel="canonical"]');
  await expect(canonical).toHaveCount(1);
  const canonicalHref = await canonical.getAttribute("href");
  expect(canonicalHref).toBeTruthy();

  const desc = page.locator('meta[name="description"]');
  await expect(desc).toHaveCount(1);
  const content = await desc.getAttribute("content");
  expect(content?.trim().length).toBeGreaterThan(0);

  const ld = page.locator('script[type="application/ld+json"]');
  expect(await ld.count()).toBeGreaterThan(0);
});