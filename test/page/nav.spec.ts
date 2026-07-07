import { test, expect } from "@playwright/test";

async function assertNavVisible(page: import("@playwright/test").Page) {
  const nav = page.getByTestId("nav");
  await expect(nav).toBeVisible();

  await expect(
    nav.getByAltText("Profile picture of Leopold Lemmermann")
  ).toBeVisible();

  await expect(nav.locator("a[href='/']").first()).toBeVisible();
}

test.describe("Global navigation", () => {
  test("on the homepage", async ({ page }) => {
    const res = await page.goto("/");
    expect(res?.status()).toBe(200);

    await assertNavVisible(page);
  });

  test("on a blog article page", async ({ page }) => {
    await page.goto("/");

    const href = await page
      .locator('[data-testid="article-carousel"] a.block[href^="/blog/"]')
      .first()
      .getAttribute("href");
    expect(href).toBeTruthy();

    const res = await page.goto(href!);
    expect(res?.status()).toBe(200);

    await assertNavVisible(page);
  });

  test("on a portfolio project page", async ({ page }) => {
    await page.goto("/");

    const href = await page.getByTestId("portfolio-card").first().getAttribute("href");
    expect(href).toBeTruthy();

    const res = await page.goto(href!);
    expect(res?.status()).toBe(200);

    await assertNavVisible(page);
  });
});
