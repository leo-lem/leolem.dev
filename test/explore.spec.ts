import { test, expect } from "@playwright/test";

test("explore page loads", async ({ page }) => {
  await page.goto("/explore");
  await expect(page.getByRole("heading", { name: "Explore" })).toBeVisible();
  
  // Test skill cards are clickable
  await expect(page.getByRole("button", { name: /SwiftUI/ })).toBeVisible();
  
  // Test sections are present
  await expect(page.getByRole("heading", { name: "Projects" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Articles" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Services" })).toBeVisible();
});

test("explore page filtering works", async ({ page }) => {
  await page.goto("/explore");
  
  // Click on SwiftUI tag
  await page.getByRole("button", { name: /SwiftUI/ }).click();
  
  // Check URL contains tag parameter
  await expect(page).toHaveURL(/tags=SwiftUI/);
  
  // Check filter status updates
  await expect(page.getByText("Showing content for 1 selected skill")).toBeVisible();
});