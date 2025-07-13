import { test, expect } from "@playwright/test";

const pages = ["about", "projects", "services"]

test.describe("Global navigation", () => {
  for (const name of pages) {
    test(`on "${name}" page`, async ({ page }) => {
      await page.goto(`/${name}/`);

      const nav = page.locator("nav");
      await expect(nav).toBeVisible();

      for (const link of pages) {
        const element = nav.getByRole("link", { name: link.toUpperCase() });
        await expect(element).toBeVisible();
        await expect(element).toHaveAttribute("href", `/${link}/`);
      }

      const currentPageLink = nav.getByRole("link", { name: name.toUpperCase() });
      await expect(currentPageLink).toHaveClass(/active/);
    });
  }
});