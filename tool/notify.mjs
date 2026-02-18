import fs from "node:fs/promises";
import path from "node:path";

const APP_ID = process.env.ONESIGNAL_APP_ID;
const API_KEY = process.env.ONESIGNAL_REST_API_KEY;
const TEMPLATE_ID = process.env.ONESIGNAL_TEMPLATE_ID;
const SITE = process.env.BASE_URL;
if (!APP_ID || !API_KEY || !TEMPLATE_ID || !SITE) throw new Error("Missing env vars");

const ROOT = process.cwd();
const CONTENT_REPO_DIR = path.join(ROOT, ".content");
const STATE = path.join(CONTENT_REPO_DIR, ".notified.json");
const BLOG_DIR = path.join(CONTENT_REPO_DIR, "content/blog");
const SEGMENT = "All";

function parseFrontmatter(md) {
  if (!md.startsWith("---")) return {};
  const end = md.indexOf("\n---", 3);
  if (end === -1) return {};
  const lines = md.slice(3, end).trim().split("\n");

  const out = {};
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

async function listMarkdownFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const out = [];

  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await listMarkdownFiles(p)));
    else if (e.isFile() && /\.(md|mdx)$/i.test(e.name)) out.push(p);
  }

  return out;
}

async function post(body) {
  const res = await fetch("https://onesignal.com/api/v1/notifications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Basic ${API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  const json = await res.json().catch(async () => ({ raw: await res.text() }));

  // Treat HTTP errors OR 200-with-errors as failures
  if (!res.ok || json?.errors?.length) {
    throw new Error(`OneSignal HTTP ${res.status}: ${JSON.stringify(json)}`);
  }

  return json;
}

const main = async () => {
  let alreadyNotified = new Set();
  try {
    alreadyNotified = new Set(JSON.parse(await fs.readFile(STATE, "utf8")));
  } catch {
    alreadyNotified = new Set();
  }

  const files = await listMarkdownFiles(BLOG_DIR);

  const articles = (await Promise.all(
    files.map(async (file) => {
      const slug = path
      .relative(BLOG_DIR, file)
      .replace(/\.(md|mdx)$/i, "")
      .split(path.sep)
      .join("/");
      if (alreadyNotified.has(slug)) return null;

      const fm = parseFrontmatter(await fs.readFile(file, "utf8"));

      if (fm.date && new Date(fm.date) > new Date()) {
        console.log("Skipping scheduled article:", slug);
        return null;
      }

      const short = (fm.short || "").trim();
      if (!short) throw new Error(`Missing frontmatter 'short' in ${file}`);

      const url = `${SITE.replace(/\/$/, "")}/blog/${slug}/`;

      return {
        slug,
        title: (fm.title || slug).trim(),
        short,
        url,
      };
    })
  )).filter(Boolean);

  if (articles.length === 0) {
    console.log("No new articles to notify.");
    return;
  }

  for (const article of articles) {
    await post({
      app_id: APP_ID,
      template_id: TEMPLATE_ID,
      custom_data: {
        title: article.title,
        short: article.short,
        url: article.url,
      },
      included_segments: [SEGMENT],
    });
    
    await post({
      app_id: APP_ID,
      headings: { en: `leolem.dev: ${article.title}` },
      contents: { en: `${article.short}.` },
      url: article.url,
      included_segments: [SEGMENT],
    });

    console.log("Sent:", article.slug);
    alreadyNotified.add(article.slug);
  }

  await fs.writeFile(
    STATE,
    JSON.stringify([...alreadyNotified].sort(), null, 2) + "\n",
    "utf8"
  );
};

try {
  await main();
} catch (e) {
  console.error(e);
  process.exit(1);
}