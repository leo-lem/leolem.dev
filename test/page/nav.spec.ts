import { test, expect } from "@playwright/test";

import { navigation } from "../../src/navigation.config";

test.describe("Global navigation", () => {
  for (const p of navigation) {
    test(`on "${p}" page`, async ({ page, isMobile }) => {
      const res = await page.goto(`/${p}/`);
      expect(res?.status()).toBe(200);

      await expect(page.getByTestId("nav")).toBeVisible();

      for (const other of navigation) {
        const link = page.getByTestId(`nav-link-${other}`);

        if (isMobile)
          await expect(link).toBeAttached();
        else
          await expect(link).toBeVisible();
      }

      await expect(page.getByTestId(`nav-link-${p}`)).toHaveAttribute("aria-current", "page");
    });
  }
});