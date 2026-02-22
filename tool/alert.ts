function withCors(request: Request, response: Response, allowed: Set<string>): Response {
  const origin = request.headers.get("Origin") || "";
  const h = new Headers(response.headers);

  if (allowed.has(origin)) h.set("access-control-allow-origin", origin);
  h.set("access-control-allow-methods", "POST, GET, OPTIONS");
  h.set("access-control-allow-headers", "content-type, x-webhook-secret");
  h.set("access-control-max-age", "86400");

  return new Response(response.body, { status: response.status, headers: h });
}

function handleMethod(request: Request): Response | null {
  if (request.method === "OPTIONS") return new Response(null, { status: 204 });
  if (request.method === "GET") return new Response("ok", { status: 200 });
  if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
  return null;
}

export async function alert(
  request: Request,
  env: {
    WEBHOOK_SECRET: string;
    ONESIGNAL_REST_API_KEY: string;
    ONESIGNAL_APP_ID: string;
    ALLOWED_ORIGINS: string;
  },
  webhookSecret: string = env.WEBHOOK_SECRET,
  apiKey: string = env.ONESIGNAL_REST_API_KEY,
  appId: string = env.ONESIGNAL_APP_ID,
  allowedOriginsRaw: string = env.ALLOWED_ORIGINS,
  templateId: string = "0f492c1c-e843-4707-afa0-ab2f20b8c253",
  segment: string = "Staging",
  apiBase: string = "https://onesignal.com"
): Promise<Response> {
  const allowed = new Set(
    allowedOriginsRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  );

  const early = handleMethod(request);
  if (early) return withCors(request, early, allowed);

  const url = new URL(request.url);
  if (url.pathname !== "/subscribe")
    return withCors(request, new Response("Not Found", { status: 404 }), allowed);

  const secret = request.headers.get("x-webhook-secret");
  if (!secret || secret !== webhookSecret)
    return withCors(request, new Response("Unauthorized", { status: 401 }), allowed);

  let payload: unknown;
  try {
    payload = await request.json();
  } catch (e) {
    return withCors(request, new Response(`Bad JSON: ${String(e)}`, { status: 400 }), allowed);
  }

  const kind = (payload as { kind?: unknown }).kind;
  if (typeof kind !== "string")
    return withCors(
      request,
      new Response("Bad JSON: Missing or invalid 'kind' field", { status: 400 }),
      allowed
    );

  const page = (payload as { page?: unknown }).page;
  const email = (payload as { email?: unknown }).email;

  const base = apiBase.replace(/\/$/, "");
  const resp = await fetch(`${base}/api/v1/notifications`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Basic ${apiKey}`,
    },
    body: JSON.stringify({
      app_id: appId,
      template_id: templateId,
      included_segments: [segment],
      custom_data: {
        kind,
        page: typeof page === "string" ? page : "unknown",
        email: typeof email === "string" ? email : "none",
      },
    }),
  });

  if (!resp.ok) {
    let text = "";
    try {
      text = await resp.text();
    } catch {
      text = "";
    }
    return withCors(request, new Response(text.slice(0, 4000), { status: 502 }), allowed);
  }

  return withCors(request, new Response("ok", { status: 200 }), allowed);
}

export default {
  fetch: (request: Request, env: { WEBHOOK_SECRET: string; ONESIGNAL_REST_API_KEY: string; ONESIGNAL_APP_ID: string; ALLOWED_ORIGINS: string }) =>
    alert(request, env),
};