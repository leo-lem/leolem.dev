import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Leopold Lemmermann/);
});

test('about page loads', async ({ page }) => {
  await page.goto('/about');
  await expect(page.getByRole('heading', { name: "I'm Leo." })).toBeVisible();
});

test('portfolio page loads', async ({ page }) => {
  await page.goto('/portfolio');
  await expect(page.getByRole('heading', { name: 'Portfolio' })).toBeVisible();
});

test('services page loads', async ({ page }) => {
  await page.goto('/services');
  await expect(page.getByRole('heading', { name: 'Services' })).toBeVisible();
});

test('explore page loads', async ({ page }) => {
  await page.goto('/explore');
  await expect(page.getByRole('heading', { name: 'Explore' })).toBeVisible();
});