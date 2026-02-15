export default {
  async fetch(request, env) {
    if (request.method === "GET")
      return new Response("ok", { status: 200 });
    if (request.method !== "POST")
      return new Response("Method Not Allowed", { status: 405 });
    const secret = request.headers.get("x-webhook-secret");
    if (!secret || secret !== env.WEBHOOK_SECRET)
      return new Response("Unauthorized", { status: 401 });
    if ((new URL(request.url)).pathname !== "/subscribe")
      return new Response("Not Found", { status: 404 });

    let payload;
    try {
      payload = await request.json();
    } catch {
      return new Response("Bad JSON", { status: 400 });
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
        channel_for_external_user_ids: "email",
        custom_data: {
          email: payload?.email ?? "unknown",
          page: payload?.page ?? "unknown",
        },
      }),
    });

    if (!resp.ok)
      return new Response((await resp.text().catch(() => "")).slice(0, 4000), { status: 502 });

    return new Response("ok", { status: 200 });
  },
};