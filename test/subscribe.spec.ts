import { test, expect } from "@playwright/test";

test("email subscribe validates, enables button, and posts alert payload", async ({ page }) => {
  await page.route("https://alert.leolem.dev/subscribe", async (route) => {
    expect(route.request().method()).toBe("POST");

    const body = route.request().postDataJSON() as {
      kind?: string;
      page?: string;
      email?: string;
    };

    expect(body.kind).toBe("email");
    expect(typeof body.page).toBe("string");
    expect(body.page?.length).toBeGreaterThan(0);
    expect(body.email).toBe("test@example.com");

    await route.fulfill({ status: 200, body: "ok" });
  });

  const res = await page.goto("/blog/");
  expect(res?.status()).toBe(200);

  // Go to a blog article (any) so we hit the subscribe panel on the article template
  const firstRow = page.getByTestId("article-row").first();
  const href = await firstRow.getAttribute("href");
  expect(href).toBeTruthy();

  const articleRes = await page.goto(href!);
  expect(articleRes?.status()).toBe(200);

  const emailInput = page.getByTestId("subscribe-email");
  const submit = page.getByTestId("subscribe-email-submit");
  const status = page.getByTestId("subscribe-status");

  await expect(submit).toBeDisabled();

  await emailInput.fill("nope");
  await expect(submit).toBeDisabled();

  await emailInput.fill("test@example.com");
  await expect(submit).toBeEnabled();

  await submit.click();

  await expect(status).toBeVisible();
});