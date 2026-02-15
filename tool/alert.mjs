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
        included_segments: ["Staging"],
        channel_for_external_user_ids: "email",
        email_subject: "New subscriber",
        email_body: `
        New subscriber: ${payload.email ?? "unknown"}
        Page: ${payload.page ?? "unknown"}`
      }),
    });

    if (!resp.ok)
      return new Response((await resp.text().catch(() => "")).slice(0, 4000), { status: 502 });
    
    return new Response("ok", { status: 200 });
  },
};