import { test, expect } from "@playwright/test";

test("offering page contains cal embed container and loads embed script", async ({ page }) => {
  await page.goto("/offering/");

  await expect(page.locator("#my-cal-inline-gettoknow")).toHaveCount(1);

  const calScript = page.locator('script[src*="app.cal.eu/embed/embed.js"]');
  await expect(calScript).toHaveCount(1);

  await expect(page.locator("#schedule-a-call")).toHaveCount(1);
});