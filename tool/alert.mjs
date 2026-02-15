function withCors(res) {
  const h = new Headers(res.headers);
  for (const [k, v] of Object.entries({
  "access-control-allow-origin": "https://leolem.dev",
  "access-control-allow-methods": "POST, GET, OPTIONS",
  "access-control-allow-headers": "content-type, x-webhook-secret",
})) h.set(k, v);
  return new Response(res.body, { status: res.status, headers: h });
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS")
      return withCors(new Response(null, { status: 204 }));
    if (request.method === "GET")
      return withCors(new Response("ok", { status: 200 }));
    if (request.method !== "POST")
      return withCors(new Response("Method Not Allowed", { status: 405 }));

    const secret = request.headers.get("x-webhook-secret");
    if (!secret || secret !== env.WEBHOOK_SECRET)
      return withCors(new Response("Unauthorized", { status: 401 }));
    if ((new URL(request.url)).pathname !== "/subscribe")
      return withCors(new Response("Not Found", { status: 404 }));

    let payload;
    try {
      payload = await request.json();
    } catch {
      return withCors(new Response("Bad JSON", { status: 400 }));
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
          kind: payload?.kind ?? "unknown",
          email: payload?.email ?? "unknown",
          page: payload?.page ?? "unknown",
        },
      }),
    });

    if (!resp.ok)
      return withCors(new Response((await resp.text().catch(() => "")).slice(0, 4000), { status: 502 }));

    return withCors(new Response("ok", { status: 200 }));
  },
};