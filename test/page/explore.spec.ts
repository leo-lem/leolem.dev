import { test, expect } from "@playwright/test";

test("explore renders skills and results, and filtering works", async ({ page }) => {
  await page.goto("/explore/");

  await expect(page.getByTestId("explore-skills")).toBeVisible();
  await expect(page.getByTestId("explore-results")).toBeVisible();

  const results = page.getByTestId("explore-result");
  expect(await results.count()).toBeGreaterThan(0);

  // Pick a topic that actually exists
  const topicCards = page.locator('[data-testid="topic-card"][data-topic-id]');
  await expect(topicCards.first()).toBeVisible();

  const topicId = await topicCards.first().getAttribute("data-topic-id");
  expect(topicId).toBeTruthy();

  await topicCards.first().click();

  // URL should now include topics=<topicId>
  await expect(page).toHaveURL(new RegExp(`[?&]topics=${encodeURIComponent(topicId!)}`));

  // Wait until filtering has actually applied (mobile needs this)
  await page.waitForFunction(
    (wanted) => {
      const els = Array.from(document.querySelectorAll('[data-testid="explore-result"]'));
      const visible = els.filter((el) => getComputedStyle(el).display !== "none");
      if (visible.length === 0) return false;

      return visible.every((el) => {
        const tags = (el.getAttribute("data-tags") || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        return tags.includes(wanted ?? "");
      });
    },
    topicId,
    { timeout: 5000 }
  );

  // Now assert the same thing explicitly (so it fails clearly)
  const allVisibleMatch = await page.evaluate((wanted) => {
    const els = Array.from(document.querySelectorAll('[data-testid="explore-result"]'));
    const visible = els.filter((el) => getComputedStyle(el).display !== "none");

    return visible.every((el) => {
      const tags = (el.getAttribute("data-tags") || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      return tags.includes(wanted ?? "");
    });
  }, topicId);

  expect(allVisibleMatch).toBe(true);

  const placeholderHidden = await page
    .getByTestId("explore-no-results")
    .evaluate((n) => n.classList.contains("hidden"));
  expect(placeholderHidden).toBe(true);
});