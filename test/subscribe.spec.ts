import { test, expect, type Page, type Request } from "@playwright/test";

type AlertBody = {
  kind?: string;
  page?: string;
  email?: string | null;
};

const ALERT_URL = "https://alert.leolem.dev/subscribe";

function isAlertSubscribeRequest(r: Request) {
  return r.url() === ALERT_URL && r.method() === "POST";
}

async function waitForAlertRequest(page: Page, kind: "email" | "push") {
  return page.waitForRequest((r) => {
    if (!isAlertSubscribeRequest(r)) return false;
    try {
      const body = r.postDataJSON() as unknown as AlertBody;
      return body.kind === kind;
    } catch {
      return false;
    }
  });
}

async function openSubscribeSection(page: Page) {
  const res = await page.goto("/blog/");
  expect(res?.status()).toBe(200);

  await page.evaluate(() => {
    location.hash = "subscribe";
  });

  const subscribe = page.getByTestId("subscribe");
  await expect(subscribe).toBeVisible();
}

async function mockAlert(page: Page) {
  const received: AlertBody[] = [];

  await page.route(ALERT_URL, async (route) => {
    try {
      received.push(route.request().postDataJSON() as unknown as AlertBody);
    } catch {
      received.push({});
    }
    await route.fulfill({ status: 200, body: "ok" });
  });

  return received;
}


test("email subscribe validates, enables button, and posts alert payload", async ({ page }) => {
  const received = await mockAlert(page);

  await openSubscribeSection(page);

  const emailInput = page.getByTestId("subscribe-email");
  const submit = page.getByTestId("subscribe-email-submit");
  const status = page.getByTestId("subscribe-status");

  await expect(submit).toBeDisabled();

  await emailInput.fill("nope");
  await expect(submit).toBeDisabled();

  await emailInput.fill("test@example.com");
  await expect.poll(async () => submit.isEnabled(), { timeout: 5000 }).toBe(true);

  const reqPromise = waitForAlertRequest(page, "email");
  await submit.click();

  const req = await reqPromise;
  const body = req.postDataJSON() as unknown as AlertBody;

  await expect(status).toBeVisible();
  await expect(status).not.toHaveClass(/text-error/);
  await expect(status).toContainText(/all set|updates|nice/i);

  expect(body.kind).toBe("email");
  expect(typeof body.page).toBe("string");
  expect((body.page || "").length).toBeGreaterThan(0);
  expect(body.email).toBe("test@example.com");

  expect(received.some((x) => x.kind === "email")).toBe(true);
});


test("push subscribe posts alert payload on @desktop", async ({ page }) => {
  const received = await mockAlert(page);

  await page.addInitScript(() => {
    const d: any = [];

    d.push = (fn: any) => {
      let changeCb: any = null;

      fn({
        Notifications: { permission: true },
        User: {
          PushSubscription: {
            optedIn: false,
            addEventListener: (_evt: string, cb: any) => {
              changeCb = cb;
            },
            optIn: () => {
              setTimeout(() => {
                if (changeCb) changeCb({ current: { optedIn: true } });
              }, 10);
            },
          },
          addEmail: (_email: string) => { },
        },
      });
    };

    (window as any).OneSignalDeferred = d;
    (window as any).OneSignal = { Deferred: d };
  });

  await openSubscribeSection(page);

  const pushBtn = page.getByTestId("subscribe-push");
  const status = page.getByTestId("subscribe-status");

  const reqPromise = waitForAlertRequest(page, "push");
  await pushBtn.click();

  const req = await reqPromise;
  const body = req.postDataJSON() as unknown as AlertBody;

  await expect(status).toBeVisible();
  await expect(status).not.toHaveClass(/text-error/);
  await expect(status).toContainText(/subscribed|already/i);

  expect(body.kind).toBe("push");
  expect(typeof body.page).toBe("string");
  expect((body.page || "").length).toBeGreaterThan(0);
  expect(body.email == null).toBe(true);

  expect(received.some((x) => x.kind === "push")).toBe(true);
});


test("push shows iOS unsupported on @mobile", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "userAgent", {
      value: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
      configurable: true,
    });
  });

  const received = await mockAlert(page);

  await openSubscribeSection(page);

  const pushBtn = page.getByTestId("subscribe-push");
  const status = page.getByTestId("subscribe-status");

  await pushBtn.click();

  await expect(status).toBeVisible();
  await expect(status).toHaveClass(/text-error/);
  await expect(status).toContainText(/ios.*not supported|not supported/i);

  expect(received.some((x) => x.kind === "push")).toBe(false);
});


test("rss endpoint returns 200 and looks like RSS or Atom", async ({ page }) => {
  const res = await page.goto("/rss.xml");
  expect(res?.status()).toBe(200);

  const body = await page.content();
  const hasRss = body.includes("<rss");
  const hasAtom = body.includes("<feed");
  expect(hasRss || hasAtom).toBe(true);
});