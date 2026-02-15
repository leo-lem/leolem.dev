export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET") {
      return new Response("ok", { status: 200 });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const secret = request.headers.get("x-webhook-secret");
    if (!secret || secret !== env.WEBHOOK_SECRET) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (url.pathname !== "/subscribe") {
      return new Response("Not Found", { status: 404 });
    }

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
    const text = [
      `Type: ${type}`,
      `Page: ${page}`,
      `Time: ${ts}`,
      `IP: ${ip}`,
      `UA: ${ua}`,
      ``,
      JSON.stringify(payload, null, 2),
    ].join("\n");

    const resp = await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: env.ALERT_TO }] }],
        from: { email: "no-reply@blog.leolem.dev", name: "Leopold Lemmermann" },
        subject,
        content: [{ type: "text/plain", value: text }],
      }),
    });

    if (!resp.ok) {
      const details = await resp.text().catch(() => "");
      return new Response(details.slice(0, 2000), { status: 502 });
    }

    return new Response("ok", { status: 200 });
  },
};