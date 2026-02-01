import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Leopold Lemmermann/);
});

const paths = [
  { name: 'about', heading: "I'm Leo." },
  { name: 'portfolio', heading: 'Portfolio' },
  { name: 'offering', heading: 'Offering' },
];

paths.forEach(path => {
  test(`${path.name} page loads`, async ({ page }) => {
    await page.goto(`/${path.name}/`);
    await expect(page.getByRole('heading', { name: path.heading })).toBeVisible();
  });
});
