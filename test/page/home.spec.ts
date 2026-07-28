import { test, expect } from "@playwright/test";
import { seedBlogFixtures, clearBlogFixtures } from "../.fixtures";

test.describe("Home article carousel", () => {
  const namespace = "home-carousel";

  test.beforeAll(() => seedBlogFixtures(namespace, 10));
  test.afterAll(() => clearBlogFixtures(namespace));

  test("scrolls horizontally on a vertical-only wheel input", async ({ page }) => {
    const carousel = page.getByTestId("article-carousel");

    await expect(async () => {
      await page.goto("/");
      await expect(carousel).toBeVisible();
      const overflowing = await carousel.evaluate(
        (el) => el.scrollWidth > el.clientWidth
      );
      expect(overflowing).toBe(true);
    }).toPass();

    const before = await carousel.evaluate((el) => el.scrollLeft);

    // Dispatch a real WheelEvent with only a vertical delta directly, rather
    // than page.mouse.wheel: that drives input through Chromium's compositor,
    // which hit-tests against the page as it scrolls and unreliably lands on
    // the carousel. A vertical-only delta is also precisely what distinguishes
    // a mouse wheel from a trackpad swipe (which carries a deltaX too), so this
    // is a more faithful simulation of the reported bug, not just a workaround.
    await carousel.evaluate((el) =>
      el.dispatchEvent(new WheelEvent("wheel", { deltaY: 300, bubbles: true }))
    );

    const after = await carousel.evaluate((el) => el.scrollLeft);
    expect(after).toBeGreaterThan(before);
  });
});

test("homepage contains cal embed container and loads embed script", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("cal-section")).toBeVisible();
  await expect(page.locator("#my-cal-inline-gettoknow")).toHaveCount(1);

  const calScript = page.locator('script[src*="app.cal.eu/embed/embed.js"]');
  await expect(calScript).toHaveCount(1);

  await expect(page.locator("#schedule-a-call")).toHaveCount(1);
});
