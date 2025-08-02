import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Leopold Lemmermann/);
});

test('about page loads', async ({ page }) => {
  await page.goto('/about');
  await expect(page.getByRole('heading', { name: "I'm Leo." })).toBeVisible();
});

test('projects page loads', async ({ page }) => {
  await page.goto('/projects');
  await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
});

test('services page loads', async ({ page }) => {
  await page.goto('/services');
  await expect(page.getByRole('heading', { name: 'Services' })).toBeVisible();
});

test('explore page loads', async ({ page }) => {
  await page.goto('/explore');
  await expect(page.getByRole('heading', { name: 'Explore' })).toBeVisible();
});