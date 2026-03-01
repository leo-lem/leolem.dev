import fs from "node:fs/promises";
import path from "node:path";
import { isExecuted } from "./lib";

export type Article = {
  slug: string;
  title: string;
  short: string;
  url: string;
};

function parseFrontmatter(md: string): Record<string, string> {
  if (!md.startsWith("---")) return {};
  const end = md.indexOf("\n---", 3);
  if (end === -1) return {};

  const lines = md.slice(3, end).trim().split("\n");
  const out: Record<string, string> = {};

  for (const line of lines) {
    const i = line.indexOf(":");
    if (i === -1) continue;

    const k = line.slice(0, i).trim();
    let v = line.slice(i + 1).trim();
    v = v.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
    out[k] = v;
  }

  return out;
}

async function listMarkdownFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const out: string[] = [];

  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await listMarkdownFiles(p)));
    else if (e.isFile() && /\.(md|mdx)$/i.test(e.name)) out.push(p);
  }

  return out;
}

function isScheduledFuture(dateStr: string | undefined): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return false;
  return d.getTime() > Date.now();
}

function buildUrl(site: string, slug: string): string {
  return `${site.replace(/\/$/, "")}/blog/${slug}/`;
}

async function readState(statePath: string): Promise<Set<string>> {
  try {
    const raw = await fs.readFile(statePath, "utf8");
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.filter((x) => typeof x === "string"));
  } catch {
    return new Set();
  }
}

function toSlug(blogDir: string, file: string): string {
  return path
    .relative(blogDir, file)
    .replace(/\.(md|mdx)$/i, "")
    .split(path.sep)
    .join("/");
}

async function post(params: {
  apiBase: string;
  apiKey: string;
  body: unknown;
}): Promise<unknown> {
  const res = await fetch(`${params.apiBase.replace(/\/$/, "")}/api/v1/notifications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Basic ${params.apiKey}`,
    },
    body: JSON.stringify(params.body),
  });

  let json: any;
  try {
    json = await res.json();
  } catch {
    const raw = await res.text();
    json = { raw };
  }

  if (!res.ok || (Array.isArray(json?.errors) && json.errors.length > 0))
    throw new Error(`OneSignal HTTP ${res.status}: ${JSON.stringify(json)}`);

  return json;
}

function sanitizeShort(s: string): string {
  return s
    .replaceAll(/\r\n/g, "\n")
    .replaceAll(/\s+/g, " ")
    .trim()
    .replace(/^[|>]\s*/, "");
}

export default async function notify(
  site: string | undefined = process.env.BASE_URL,
  appId: string | undefined = process.env.ONESIGNAL_APP_ID,
  apiKey: string | undefined = process.env.ONESIGNAL_REST_API_KEY,
  templateId: string | undefined = process.env.ONESIGNAL_TEMPLATE_ID,
  segment: string = "All",
  apiBase: string = "https://onesignal.com",
  root: string = process.cwd(),
  from: string = path.join(root, ".content"),
  stateFile: string = path.join(from, ".notified.json"),
  blogDir: string = path.join(from, "content", "blog")
): Promise<{ sent: Article[]; skippedScheduled: string[]; skippedAlready: string[] }> {
  if (!appId || !apiKey || !templateId || !site)
    throw new Error("Missing env vars");

  const alreadyNotified = await readState(stateFile);
  const files = await listMarkdownFiles(blogDir);

  const skippedScheduled: string[] = [];
  const skippedAlready: string[] = [];
  const toSend: Article[] = [];

  for (const file of files) {
    const slug = toSlug(blogDir, file);

    if (alreadyNotified.has(slug)) {
      skippedAlready.push(slug);
      continue;
    }

    const fm = parseFrontmatter(await fs.readFile(file, "utf8"));

    if (isScheduledFuture(fm.date)) {
      skippedScheduled.push(slug);
      continue;
    }

    const short = sanitizeShort(fm.short || "");

    toSend.push({
      slug,
      title: (fm.title || slug).trim(),
      short,
      url: buildUrl(site, slug),
    });
  }

  if (toSend.length === 0)
    return { sent: [], skippedScheduled, skippedAlready };

  for (const article of toSend) {
    await post({
      apiBase,
      apiKey,
      body: {
        app_id: appId,
        template_id: templateId,
        custom_data: {
          title: article.title,
          short: article.short,
          url: article.url,
        },
        included_segments: [segment],
      },
    });

    await post({
      apiBase,
      apiKey,
      body: {
        app_id: appId,
        headings: { en: `leolem.dev: ${article.title}` },
        contents: { en: `${article.short}.` },
        url: article.url,
        included_segments: [segment],
      },
    });

    alreadyNotified.add(article.slug);
  }

  await fs.mkdir(path.dirname(stateFile), { recursive: true });
  await fs.writeFile(stateFile, JSON.stringify([...alreadyNotified].sort(), null, 2) + "\n", "utf8");

  return { sent: toSend, skippedScheduled, skippedAlready };
}

if (isExecuted(import.meta.url)) {
  const { sent, skippedScheduled } = await notify();

  for (const article of skippedScheduled)
    console.log("Skipping scheduled article:", article);

  if (sent.length === 0)
    console.log("No new articles to notify.");
  else for (const article of sent)
    console.log("Sent:", article.slug);
}