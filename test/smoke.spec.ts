import { test, expect } from "@playwright/test";

test("homepage loads and nav is present", async ({ page }) => {
  const res = await page.goto("/");
  expect(res?.status()).toBe(200);

  await expect(page).toHaveTitle(/Leopold Lemmermann/);

  const nav = page.getByTestId("nav");
  await expect(nav).toBeVisible();
  await expect(
    nav.getByAltText("Profile picture of Leopold Lemmermann")
  ).toBeVisible();
});

const pages = [
  { name: "portfolio", url: "/portfolio/", title: /Portfolio/i },
  { name: "blog", url: "/blog/", title: /Blog/i },
];

for (const p of pages) {
  test(`${p.name} page loads and nav is present`, async ({ page }) => {
    const res = await page.goto(p.url);
    expect(res?.status()).toBe(200);

    await expect(page).toHaveTitle(p.title);
    await expect(page.getByTestId("nav")).toBeVisible();
  });
}

test("404 page renders", async ({ page }) => {
  const res = await page.goto("/this/definitely/does/not/exist/");
  expect(res?.status()).toBe(404);
});

test("blog article renders, has subscribe panel, and shows related articles", async ({ page }) => {
  const res = await page.goto("/blog/");
  expect(res?.status()).toBe(200);

  const rows = page.getByTestId("article-row");
  expect(await rows.count()).toBeGreaterThan(0);

  const maxTries = Math.min(await rows.count(), 10);

  for (let i = 0; i < maxTries; i++) {
    const href = await rows.nth(i).getAttribute("href");
    if (!href) continue;

    const articleRes = await page.goto(href);
    expect(articleRes?.status()).toBe(200);

    await expect(page.getByTestId("blog-content")).toBeVisible();

    await expect(page.getByTestId("subscribe")).toBeVisible();
    await expect(page.getByTestId("subscribe-email")).toBeVisible();
    await expect(page.getByTestId("subscribe-email-submit")).toBeVisible();

    const related = page.getByTestId("related-articles");
    await expect(related).toBeVisible();

    const relatedRows = related.getByTestId("article-row");
    expect(await relatedRows.count()).toBeGreaterThan(0);

    return;
  }

  throw new Error("Could not find a blog article link to test.");
});

test("homepage has cal embed container", async ({ page }) => {
  const res = await page.goto("/");
  expect(res?.status()).toBe(200);

  await expect(page.getByTestId("cal-section")).toBeVisible();
  await expect(page.getByTestId("cal-embed")).toBeVisible();
});