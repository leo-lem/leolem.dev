import { test, expect, type Page } from "@playwright/test";
import { seedBlogFixtures, clearBlogFixtures } from "../.fixtures";

const namespace = "blog-routes";

test.beforeAll(() => seedBlogFixtures(namespace, 3));
test.afterAll(() => clearBlogFixtures(namespace));

test("/blog/ redirects to the homepage", async ({ request }) => {
  const res = await request.get("/blog/", { maxRedirects: 0 });
  expect(res.status()).toBe(301);
  expect(res.headers()["location"]).toBe("/");
});

async function collectBlogArticleHrefs(page: Page, max: number): Promise<string[]> {
  const cards = page.locator('[data-testid="article-carousel"] a.block[href^="/blog/"]');

  let unique: string[] = [];
  await expect(async () => {
    await page.goto("/");
    await expect(cards.first()).toBeVisible();

    const hrefs = await cards.evaluateAll((els) =>
      els
        .map((el) => el.getAttribute("href") ?? "")
        .filter((h) => h.startsWith("/blog/") && h !== "/blog/")
    );

    unique = Array.from(new Set(hrefs));
    expect(unique.length).toBeGreaterThanOrEqual(3);
  }).toPass();

  return unique.slice(0, Math.min(unique.length, max));
}

test("blog subfolder routes resolve for multiple articles", async ({ page }) => {
  const hrefs = await collectBlogArticleHrefs(page, 5);

  for (const href of hrefs) {
    const res = await page.goto(href);
    expect(res?.status()).toBe(200);

    await expect(page.getByTestId("thumbnail").first()).toBeVisible();
    await expect(page.getByTestId("blog-content")).toBeVisible();
  }
});

test("non-existent blog route 404s", async ({ page }) => {
  const res = await page.goto("/blog/this/definitely/does/not/exist/");
  expect(res?.status()).toBe(404);
});

test("every tested blog article shows related articles and excludes itself", async ({ page }) => {
  const hrefs = await collectBlogArticleHrefs(page, 5);

  for (const href of hrefs) {
    await page.goto(href);

    const related = page.getByTestId("related-articles");
    await expect(related).toBeVisible();

    const relatedRows = related.getByTestId("article-row");
    await expect(relatedRows.first()).toBeVisible();

    const currentPath = new URL(page.url()).pathname;

    const relatedHrefs = await relatedRows.evaluateAll((els) =>
      els
        .map((el) => el.getAttribute("href") ?? "")
        .filter((h) => h.length > 0)
    );

    expect(relatedHrefs.length).toBeGreaterThan(0);

    for (const r of relatedHrefs) {
      const rp = new URL(r, "https://x").pathname;
      expect(rp).not.toBe(currentPath);
    }
  }
});
