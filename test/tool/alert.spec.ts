import { test, expect } from "@playwright/test";
import { alert } from "../../tool/alert";

type Env = {
  WEBHOOK_SECRET: string;
  ONESIGNAL_REST_API_KEY: string;
  ONESIGNAL_APP_ID: string;
  ALLOWED_ORIGINS: string;
};

function mkEnv(overrides: Partial<Env> = {}): Env {
  return {
    WEBHOOK_SECRET: "secret",
    ONESIGNAL_REST_API_KEY: "api-key",
    ONESIGNAL_APP_ID: "app-id",
    ALLOWED_ORIGINS: "https://leolem.dev,http://localhost:4321",
    ...overrides,
  };
}

function cors(res: Response) {
  return {
    origin: res.headers.get("access-control-allow-origin"),
    methods: res.headers.get("access-control-allow-methods"),
    headers: res.headers.get("access-control-allow-headers"),
    maxAge: res.headers.get("access-control-max-age"),
  };
}

test.describe.configure({ mode: "serial" });

test("OPTIONS returns 204 and sets CORS for allowed origin", async () => {
  const env = mkEnv();
  const req = new Request("https://alert.leolem.dev/subscribe", {
    method: "OPTIONS",
    headers: { Origin: "https://leolem.dev" },
  });

  const res = await alert(req, env);

  expect(res.status).toBe(204);

  const h = cors(res);
  expect(h.origin).toBe("https://leolem.dev");
  expect(h.methods).toBeTruthy();
  expect(h.headers).toBeTruthy();
  expect(h.maxAge).toBeTruthy();
});

test("GET returns 200 ok and sets CORS for allowed origin", async () => {
  const env = mkEnv();
  const req = new Request("https://alert.leolem.dev/subscribe", {
    method: "GET",
    headers: { Origin: "http://localhost:4321" },
  });

  const res = await alert(req, env);

  expect(res.status).toBe(200);
  expect(await res.text()).toBe("ok");
  expect(cors(res).origin).toBe("http://localhost:4321");
});

test("disallowed origin does not get allow-origin header", async () => {
  const env = mkEnv();
  const req = new Request("https://alert.leolem.dev/subscribe", {
    method: "GET",
    headers: { Origin: "https://evil.example" },
  });

  const res = await alert(req, env);

  expect(res.status).toBe(200);
  expect(cors(res).origin).toBe(null);
});

test("non-POST non-GET non-OPTIONS returns 405 with CORS", async () => {
  const env = mkEnv();
  const req = new Request("https://alert.leolem.dev/subscribe", {
    method: "PUT",
    headers: { Origin: "https://leolem.dev" },
  });

  const res = await alert(req, env);

  expect(res.status).toBe(405);
  expect(await res.text()).toBe("Method Not Allowed");
  expect(cors(res).origin).toBe("https://leolem.dev");
});

test("POST wrong path returns 404 with CORS", async () => {
  const env = mkEnv();
  const req = new Request("https://alert.leolem.dev/nope", {
    method: "POST",
    headers: {
      Origin: "https://leolem.dev",
      "x-webhook-secret": "secret",
      "content-type": "application/json",
    },
    body: JSON.stringify({ kind: "subscribe" }),
  });

  const res = await alert(req, env);

  expect(res.status).toBe(404);
  expect(await res.text()).toBe("Not Found");
  expect(cors(res).origin).toBe("https://leolem.dev");
});

test("POST missing or wrong secret returns 401 with CORS", async () => {
  const env = mkEnv();

  const reqMissing = new Request("https://alert.leolem.dev/subscribe", {
    method: "POST",
    headers: {
      Origin: "https://leolem.dev",
      "content-type": "application/json",
    },
    body: JSON.stringify({ kind: "subscribe" }),
  });

  const resMissing = await alert(reqMissing, env);
  expect(resMissing.status).toBe(401);
  expect(await resMissing.text()).toBe("Unauthorized");
  expect(cors(resMissing).origin).toBe("https://leolem.dev");

  const reqWrong = new Request("https://alert.leolem.dev/subscribe", {
    method: "POST",
    headers: {
      Origin: "https://leolem.dev",
      "x-webhook-secret": "nope",
      "content-type": "application/json",
    },
    body: JSON.stringify({ kind: "subscribe" }),
  });

  const resWrong = await alert(reqWrong, env);
  expect(resWrong.status).toBe(401);
  expect(await resWrong.text()).toBe("Unauthorized");
  expect(cors(resWrong).origin).toBe("https://leolem.dev");
});

test("POST bad JSON returns 400 with CORS", async () => {
  const env = mkEnv();

  const req = new Request("https://alert.leolem.dev/subscribe", {
    method: "POST",
    headers: {
      Origin: "https://leolem.dev",
      "x-webhook-secret": "secret",
      "content-type": "application/json",
    },
    body: "{",
  });

  const res = await alert(req, env);

  expect(res.status).toBe(400);
  const txt = await res.text();
  expect(txt.startsWith("Bad JSON:")).toBe(true);
  expect(cors(res).origin).toBe("https://leolem.dev");
});

test("POST missing kind returns 400 with CORS", async () => {
  const env = mkEnv();

  const req = new Request("https://alert.leolem.dev/subscribe", {
    method: "POST",
    headers: {
      Origin: "https://leolem.dev",
      "x-webhook-secret": "secret",
      "content-type": "application/json",
    },
    body: JSON.stringify({ page: "/x", email: "a@b.com" }),
  });

  const res = await alert(req, env);

  expect(res.status).toBe(400);
  expect(await res.text()).toContain("Missing or invalid 'kind'");
  expect(cors(res).origin).toBe("https://leolem.dev");
});

test("success posts to OneSignal with expected body and returns 200 ok", async () => {
  const env = mkEnv();

  const calls: Array<{ url: string; init: RequestInit | undefined }> = [];
  const origFetch = globalThis.fetch;

  globalThis.fetch = (async (input: any, init?: any) => {
    calls.push({ url: String(input), init });
    return new Response("ok", { status: 200 });
  }) as any;

  try {
    const req = new Request("https://alert.leolem.dev/subscribe", {
      method: "POST",
      headers: {
        Origin: "https://leolem.dev",
        "x-webhook-secret": "secret",
        "content-type": "application/json",
      },
      body: JSON.stringify({ kind: "subscribe", page: "/blog/x", email: "x@y.z" }),
    });

    const res = await alert(req, env);

    expect(res.status).toBe(200);
    expect(await res.text()).toBe("ok");
    expect(cors(res).origin).toBe("https://leolem.dev");

    expect(calls.length).toBe(1);
    expect(calls[0].url).toBe("https://onesignal.com/api/v1/notifications");

    const init = calls[0].init;
    expect(init?.method).toBe("POST");

    const headers = init?.headers as Record<string, string> | undefined;
    expect(headers?.authorization).toBe("Basic api-key");
    expect(headers?.["content-type"]).toBe("application/json");

    const body = JSON.parse(String(init?.body));
    expect(body.app_id).toBe("app-id");
    expect(body.template_id).toBe("0f492c1c-e843-4707-afa0-ab2f20b8c253");
    expect(body.included_segments).toEqual(["Staging"]);
    expect(body.custom_data.kind).toBe("subscribe");
    expect(body.custom_data.page).toBe("/blog/x");
    expect(body.custom_data.email).toBe("x@y.z");
  } finally {
    globalThis.fetch = origFetch;
  }
});

test("upstream non-200 returns 502 and includes truncated upstream text", async () => {
  const env = mkEnv();

  const origFetch = globalThis.fetch;
  globalThis.fetch = (async () => {
    const big = "x".repeat(10_000);
    return new Response(big, { status: 500 });
  }) as any;

  try {
    const req = new Request("https://alert.leolem.dev/subscribe", {
      method: "POST",
      headers: {
        Origin: "https://leolem.dev",
        "x-webhook-secret": "secret",
        "content-type": "application/json",
      },
      body: JSON.stringify({ kind: "subscribe" }),
    });

    const res = await alert(req, env);

    expect(res.status).toBe(502);
    const txt = await res.text();
    expect(txt.length).toBeLessThanOrEqual(4000);
    expect(txt.length).toBeGreaterThan(0);
    expect(cors(res).origin).toBe("https://leolem.dev");
  } finally {
    globalThis.fetch = origFetch;
  }
});