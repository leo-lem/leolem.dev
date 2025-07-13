import { test, expect } from '@playwright/test';

const links = ['about', 'projects', 'services'];

test('homepage has expected links', async ({ page }) => {
  await page.goto('/');

  for (const href of links) {
    const link = page.locator(`xpath=//a[@href="/${href}" and not(ancestor::nav)]`);
    await expect(link).toHaveCount(1);
  }
});