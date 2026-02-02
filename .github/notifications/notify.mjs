import fs from "node:fs/promises";
import path from "node:path";

const APP_ID = process.env.ONESIGNAL_APP_ID;
if (!APP_ID) throw new Error("Missing env var: ONESIGNAL_APP_ID");
const API_KEY = process.env.ONESIGNAL_REST_API_KEY;
if (!API_KEY) throw new Error("Missing env var: ONESIGNAL_REST_API_KEY");
const SITE = process.env.SITE_URL;
if (!SITE) throw new Error("Missing env var: SITE_URL");

const ROOT = process.cwd();
const CONTENT_REPO_DIR = process.env.CONTENT_REPO_DIR || ".content";
const STATE = path.join(ROOT, CONTENT_REPO_DIR, ".github/notified.json");
const TEMPLATE = path.join(ROOT, ".github/notifications/email.html");
const BLOG_DIR = path.join(ROOT, CONTENT_REPO_DIR, "content/blog");


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

  if (!res.ok || json?.errors?.length)
    throw new Error(`OneSignal HTTP ${res.status}: ${JSON.stringify(json)}`);

  return json;
}

const main = async () => {
  let alreadyNotified = new Set();
  try {
    alreadyNotified = new Set(JSON.parse(await fs.readFile(STATE, "utf8")));
  } catch {
    alreadyNotified = new Set();
  }

  const template = await fs.readFile(TEMPLATE, "utf8");

  const files = (await fs.readdir(BLOG_DIR))
    .filter((f) => /\.(md|mdx)$/i.test(f))
    .map((f) => path.join(BLOG_DIR, f));
  const articles = (await Promise.all(
    files.map(async (file) => {
      const slug = path.basename(file).replace(/\.(md|mdx)$/i, "");

      const fm = parseFrontmatter(await fs.readFile(file, "utf8"));

      if (fm.date && new Date(fm.date) > new Date()) {
        console.log("Skipping future article:", slug);
        return null;
      }

      const short = (fm.short || "").trim();
      if (!short) throw new Error(`Missing frontmatter 'short' in ${file}`);

      return {
        slug,
        url: `${SITE.replace(/\/$/, "")}/blog/${slug}/`,
        title: (fm.title || slug).trim(),
        short
      };
    })
  ))
  .filter(Boolean)
  .filter((a) => !alreadyNotified.has(a.slug));
  
  if (articles.length === 0) {
    console.log("No new articles to notify.");
    return;
  }

  for (const article of articles) {
    await post({
      app_id: APP_ID,
      included_segments: ["All"],
      url: article.url,
      headings: { en: `leolem.dev: ${article.title}` },
      contents: { en: article.short },
    });

    await post({
      app_id: APP_ID,
      included_segments: ["All"],
      email_subject: `New article on leolem.dev: ${article.title}`,
      email_body: template.replace(/{{(\w+)}}/g, (_, k) => article[k] ?? ""),
    });

    console.log("Sent:", article.slug);
    alreadyNotified.add(article.slug);
  }

  await fs.writeFile(STATE, JSON.stringify([...alreadyNotified].sort(), null, 2) + "\n", "utf8");
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});