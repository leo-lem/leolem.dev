import { test, expect } from "@playwright/test";

test("sponsors embed is centered on portfolio pages", async ({ page }) => {
  await page.goto("/portfolio/this/");

  const sponsors = page.getByTitle("Sponsor me on GitHub");
  await expect(sponsors).toBeVisible();

  await expect(sponsors).toHaveClass(/mx-auto/);
  await expect(sponsors).toHaveClass(/max-w-2xl/);
});
