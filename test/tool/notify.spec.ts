import { test as base, expect } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import http from "node:http";

import notify from "../../tool/notify";

type ServerCapture = {
  apiBase: string;
  received: unknown[];
  headers: Array<{ auth?: string; contentType?: string }>;
};

type TmpRepo = {
  tmpRoot: string;
  from: string;
  blogDir: string;
  stateFile: string;
};

function md(frontmatter: Record<string, string>, body = "Hello") {
  const fm = Object.entries(frontmatter)
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join("\n");
  return `---\n${fm}\n---\n\n${body}\n`;
}

async function write(p: string, content: string) {
  await fs.mkdir(path.dirname(p), { recursive: true });
  await fs.writeFile(p, content, "utf8");
}

async function readJson<T>(p: string): Promise<T> {
  return JSON.parse(await fs.readFile(p, "utf8")) as T;
}

const test = base.extend<{ capture: ServerCapture; repo: TmpRepo }>({
  capture: async ({ }, use) => {
    const received: unknown[] = [];
    const headers: Array<{ auth?: string; contentType?: string }> = [];

    const server = http.createServer((req, res) => {
      if (req.method !== "POST" || req.url !== "/api/v1/notifications") {
        res.statusCode = 404;
        res.end("nope");
        return;
      }

      headers.push({
        auth: req.headers.authorization,
        contentType: req.headers["content-type"],
      });

      let buf = "";
      req.on("data", (c) => (buf += String(c)));
      req.on("end", () => {
        try {
          received.push(JSON.parse(buf));
        } catch {
          received.push({ raw: buf });
        }
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ id: "test-id", recipients: 1 }));
      });
    });

    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", () => resolve()));
    const addr = server.address();
    if (!addr || typeof addr === "string") throw new Error("Server did not bind");

    const apiBase = `http://127.0.0.1:${addr.port}`;

    try {
      await use({ apiBase, received, headers });
    } finally {
      server.close();
    }
  },

  repo: async ({ }, use) => {
    const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), "leolem-notify-"));
    const from = path.join(tmpRoot, ".content");
    const blogDir = path.join(from, "content", "blog");
    const stateFile = path.join(from, ".notified.json");

    const nowIso = new Date(Date.now() - 60_000).toISOString();
    const futureIso = new Date(Date.now() + 7 * 24 * 3600_000).toISOString();

    await write(
      path.join(blogDir, "vigil", "framework.mdx"),
      md({ title: "Vigil Framework", short: "A thing.", date: nowIso, tags: "Vigil" })
    );

    await write(
      path.join(blogDir, "balance.mdx"),
      md({ title: "Balance", short: "Another thing.", date: nowIso, tags: "Life" })
    );

    await write(
      path.join(blogDir, "scheduled.mdx"),
      md({ title: "Scheduled", short: "Should not send.", date: futureIso, tags: "Future" })
    );

    await write(
      path.join(blogDir, "already", "sent.mdx"),
      md({ title: "Already", short: "Should be skipped.", date: nowIso, tags: "Skip" })
    );

    await fs.mkdir(path.dirname(stateFile), { recursive: true });
    await fs.writeFile(stateFile, JSON.stringify(["already/sent"], null, 2), "utf8");

    try {
      await use({ tmpRoot, from, blogDir, stateFile });
    } finally {
      await fs.rm(tmpRoot, { recursive: true, force: true });
    }
  },
});

test.describe.configure({ mode: "serial" });

const site = "http://localhost:4321/";
const appId = "app";
const apiKey = "key";
const templateId = "tpl";
const segment = "Staging";

test("notify sends 2 posts per new article (template + direct)", async ({ capture, repo }) => {
  const r = await notify(
    site,
    appId,
    apiKey,
    templateId,
    segment,
    capture.apiBase,
    repo.tmpRoot,
    repo.from,
    repo.stateFile,
    repo.blogDir
  );

  expect(r.sent.map((a) => a.slug).sort()).toEqual(["balance", "vigil/framework"]);
  expect(capture.received.length).toBe(4);

  const bodies = capture.received as Array<Record<string, unknown>>;

  const templatePosts = bodies.filter((b) => typeof b.template_id === "string");
  const directPosts = bodies.filter((b) => typeof (b as any).headings?.en === "string" && typeof (b as any).contents?.en === "string");

  expect(templatePosts.length).toBe(2);
  expect(directPosts.length).toBe(2);

  for (const b of templatePosts) {
    expect(b.app_id).toBe(appId);
    expect(b.included_segments).toEqual([segment]);
    expect(b.template_id).toBe(templateId);
  }

  for (const b of directPosts) {
    expect(b.app_id).toBe(appId);
    expect(b.included_segments).toEqual([segment]);
    expect(String((b as any).headings.en)).toContain("leolem.dev:");
    expect(String((b as any).contents.en).trim().endsWith(".")).toBe(true);
  }

  const urls = bodies
    .map((b) => (b.url as string | undefined) || ((b.custom_data as any)?.url as string | undefined))
    .filter((u): u is string => typeof u === "string");

  expect(urls).toContain("http://localhost:4321/blog/vigil/framework/");
  expect(urls).toContain("http://localhost:4321/blog/balance/");
});

test("notify skips scheduled future posts and already-notified slugs", async ({ capture, repo }) => {
  const r = await notify(
    site,
    appId,
    apiKey,
    templateId,
    segment,
    capture.apiBase,
    repo.tmpRoot,
    repo.from,
    repo.stateFile,
    repo.blogDir
  );

  expect(r.skippedScheduled).toEqual(["scheduled"]);
  expect(r.skippedAlready).toEqual(["already/sent"]);

  const bodies = capture.received as Array<Record<string, unknown>>;
  const urls = bodies
    .map((b) => (b.url as string | undefined) || ((b.custom_data as any)?.url as string | undefined))
    .filter((u): u is string => typeof u === "string");

  expect(urls.some((u) => u.includes("/blog/scheduled/"))).toBe(false);
  expect(urls.some((u) => u.includes("/blog/already/sent/"))).toBe(false);
});

test("notify writes state and is idempotent on rerun", async ({ capture, repo }) => {
  const r1 = await notify(
    site,
    appId,
    apiKey,
    templateId,
    segment,
    capture.apiBase,
    repo.tmpRoot,
    repo.from,
    repo.stateFile,
    repo.blogDir
  );

  expect(r1.sent.length).toBe(2);

  const state1 = await readJson<string[]>(repo.stateFile);
  expect(state1).toContain("already/sent");
  expect(state1).toContain("balance");
  expect(state1).toContain("vigil/framework");
  expect(state1).not.toContain("scheduled");

  const before = capture.received.length;

  const r2 = await notify(
    site,
    appId,
    apiKey,
    templateId,
    segment,
    capture.apiBase,
    repo.tmpRoot,
    repo.from,
    repo.stateFile,
    repo.blogDir
  );

  expect(r2.sent.length).toBe(0);
  expect(capture.received.length).toBe(before);

  const state2 = await readJson<string[]>(repo.stateFile);
  expect(state2).toEqual(state1);
});

test("notify uses Basic auth header and JSON content-type", async ({ capture, repo }) => {
  await notify(
    site,
    appId,
    apiKey,
    templateId,
    segment,
    capture.apiBase,
    repo.tmpRoot,
    repo.from,
    repo.stateFile,
    repo.blogDir
  );

  expect(capture.headers.length).toBeGreaterThan(0);

  for (const h of capture.headers) {
    expect(h.auth).toBe(`Basic ${apiKey}`);
    expect(String(h.contentType || "")).toContain("application/json");
  }
});