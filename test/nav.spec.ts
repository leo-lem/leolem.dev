import { test, expect } from "@playwright/test";

const pages = [
  { name: "blog", url: "/blog/", linkId: "nav-link-blog" },
  { name: "portfolio", url: "/portfolio/", linkId: "nav-link-portfolio" },
  { name: "offering", url: "/offering/", linkId: "nav-link-offering" },
  { name: "explore", url: "/explore/", linkId: "nav-link-explore" },
  { name: "about", url: "/about/", linkId: "nav-link-about" },
];

test.describe("Global navigation", () => {
  for (const p of pages) {
    test(`on "${p.name}" page`, async ({ page }) => {
      const res = await page.goto(p.url);
      expect(res?.status()).toBe(200);

      await expect(page.getByTestId("nav")).toBeVisible();

      for (const other of pages) {
        await expect(page.getByTestId(other.linkId)).toBeVisible();
      }

      await expect(page.getByTestId(p.linkId)).toHaveAttribute("aria-current", "page");
    });
  }
});