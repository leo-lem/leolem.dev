import { test, expect } from "@playwright/test";

const pages = ["/", "/blog/", "/portfolio/"];

test.describe("Global navigation", () => {
  for (const p of pages) {
    test(`on "${p}" page`, async ({ page }) => {
      const res = await page.goto(p);
      expect(res?.status()).toBe(200);

      const nav = page.getByTestId("nav");
      await expect(nav).toBeVisible();

      await expect(
        nav.getByAltText("Profile picture of Leopold Lemmermann")
      ).toBeVisible();

      await expect(nav.locator("a[href='/']").first()).toBeVisible();
    });
  }
});
