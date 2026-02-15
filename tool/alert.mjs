const ALLOWED_ORIGINS = new Set(["https://leolem.dev", "http://localhost:4321"]);

function withCors(request, response) {
  const origin = request.headers.get("Origin") || "";
  const h = new Headers(response.headers);

  if (ALLOWED_ORIGINS.has(origin)) h.set("access-control-allow-origin", origin);
  h.set("access-control-allow-methods", "POST, GET, OPTIONS");
  h.set("access-control-allow-headers", "content-type, x-webhook-secret");
  h.set("access-control-max-age", "86400");

  return new Response(response.body, { status: response.status, headers: h });
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS")
      return withCors(request, new Response(null, { status: 204 }));
    if (request.method === "GET")
      return withCors(request, new Response("ok", { status: 200 }));
    if (request.method !== "POST")
      return withCors(request, new Response("Method Not Allowed", { status: 405 }));

    const secret = request.headers.get("x-webhook-secret");
    if (!secret || secret !== env.WEBHOOK_SECRET)
      return withCors(request, new Response("Unauthorized", { status: 401 }));
    if ((new URL(request.url)).pathname !== "/subscribe")
      return withCors(request, new Response("Not Found", { status: 404 }));

    let payload;
    try {
      payload = await request.json();
      if (typeof payload.kind !== "string")
        throw new Error("Missing or invalid 'kind' field");
    } catch (e) {
      return withCors(request, new Response(`Bad JSON: ${e.message}`, { status: 400 }));
    }

    const resp = await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Basic ${env.ONESIGNAL_REST_API_KEY}`,
      },
      body: JSON.stringify({
        app_id: env.ONESIGNAL_APP_ID,
        template_id: "0f492c1c-e843-4707-afa0-ab2f20b8c253",
        included_segments: ["Staging"],
        custom_data: {
          kind: payload.kind,
          page: payload.page ?? "unknown",
          email: payload.email ?? "none"
        },
      }),
    });

    if (!resp.ok)
      return withCors(request, new Response((await resp.text().catch(() => "")).slice(0, 4000), { status: 502 }));

    return withCors(request, new Response("ok", { status: 200 }));
  },
};