export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET") return new Response("ok", { status: 200 });
    if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

    const secret = request.headers.get("x-webhook-secret");
    if (!secret || secret !== env.WEBHOOK_SECRET) return new Response("Unauthorized", { status: 401 });

    if (url.pathname !== "/subscribe") return new Response("Not Found", { status: 404 });

    let payload;
    try {
      payload = await request.json();
    } catch {
      return new Response("Bad JSON", { status: 400 });
    }

    const type = payload?.type ?? "subscribe";
    const page = payload?.page ?? "unknown";
    const ts = payload?.ts ?? new Date().toISOString();
    const ip = request.headers.get("cf-connecting-ip") || "unknown";
    const ua = request.headers.get("user-agent") || "unknown";

    const subject = `New subscriber (${type})`;
    const body = [
      `Type: ${type}`,
      `Page: ${page}`,
      `Time: ${ts}`,
      `IP: ${ip}`,
      `UA: ${ua}`,
      ``,
      JSON.stringify(payload, null, 2),
    ].join("\n");

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
        email_subject: subject,
        email_body: `<pre style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; white-space: pre-wrap;">${escapeHtml(body)}</pre>`,
        contents: { en: body },
        headings: { en: subject },
      }),
    });

    if (!resp.ok) {
      const details = await resp.text().catch(() => "");
      return new Response(details.slice(0, 4000), { status: 502 });
    }

    return new Response("ok", { status: 200 });
  },
};

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}