import { test, expect } from "@playwright/test";

test("/portfolio/ redirects to the homepage", async ({ request }) => {
  const res = await request.get("/portfolio/", { maxRedirects: 0 });
  expect(res.status()).toBe(301);
  expect(res.headers()["location"]).toBe("/");
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
