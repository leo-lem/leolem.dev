import { test, expect } from "@playwright/test";

async function openSubscribeSection(page: import("@playwright/test").Page) {
  const res = await page.goto("/blog/");
  expect(res?.status()).toBe(200);

  await page.evaluate(() => {
    location.hash = "subscribe";
  });

  const subscribe = page.getByTestId("subscribe");
  await expect(subscribe).toBeVisible();
}

test("email subscribe validates, enables button, and calls OneSignal addEmail", async ({ page }) => {
  await page.route("https://cdn.onesignal.com/**", (route) => route.abort());

  await page.addInitScript(() => {
    const d: any = [];

    d.push = (fn: any) => {
      fn({
        User: {
          addEmail: (email: string) => {
            (window as any).__addedEmails = (window as any).__addedEmails || [];
            (window as any).__addedEmails.push(email);
          },
        },
      });
    };

    (globalThis as any).OneSignalDeferred = d;
  });

  await openSubscribeSection(page);

  const emailInput = page.getByTestId("subscribe-email");
  const submit = page.getByTestId("subscribe-email-submit");
  const status = page.getByTestId("subscribe-status");

  await expect(submit).toBeDisabled();

  await emailInput.fill("nope");
  await expect(submit).toBeDisabled();

  await emailInput.fill("test@example.com");
  await expect.poll(async () => submit.isEnabled(), { timeout: 5000 }).toBe(true);

  await submit.click();

  await expect(status).toBeVisible();
  await expect(status).not.toHaveClass(/text-error/);
  await expect(status).toContainText(/all set|updates|nice/i);

  const added = await page.evaluate(() => (window as any).__addedEmails);
  expect(added).toEqual(["test@example.com"]);
});

test("rss endpoint returns 200 and looks like RSS or Atom", async ({ request }) => {
  const res = await request.get("/rss.xml");
  expect(res.status()).toBe(200);

  const body = await res.text();
  expect(body.includes("<rss") || body.includes("<feed")).toBe(true);
});
