import { test, expect } from "@playwright/test";

test("portfolio index has at least one item and a detail page loads", async ({ page }) => {
  await page.goto("/portfolio/");

  const links = page.locator('a[href^="/portfolio/"]');
  await expect(links.first()).toBeVisible();

  const hrefs = await links.evaluateAll((els) =>
    els
      .map((el) => el.getAttribute("href") ?? "")
      .filter((h) => h.length > "/portfolio/".length)
  );
  expect(hrefs.length).toBeGreaterThan(0);

  const res = await page.goto(hrefs[0]);
  expect(res?.status()).toBe(200);

  const thumbs = page.getByTestId("thumbnail");
  await expect(thumbs.first()).toBeVisible();
});

test("homepage catalog shows portfolio cards linking to detail pages", async ({ page }) => {
  await page.goto("/");

  const cards = page.getByTestId("portfolio-card");
  await expect(cards.first()).toBeVisible();
  expect(await cards.count()).toBeGreaterThan(0);

  const href = await cards.first().evaluate((el) => el.getAttribute("href"));
  expect(href).toBeTruthy();

  const res = await page.goto(href!);
  expect(res?.status()).toBe(200);

  const thumbs = page.getByTestId("thumbnail");
  await expect(thumbs.first()).toBeVisible();
});
