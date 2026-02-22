import { test, expect } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";

import sync from "../../tool/sync";

test.describe.configure({ mode: "serial" });

async function writeFile(p: string, contents: string | Buffer) {
  await fs.mkdir(path.dirname(p), { recursive: true });
  await fs.writeFile(p, contents);
}

async function read(p: string) {
  return fs.readFile(p, "utf8");
}

test("sync copies content and assets from .content into src", async () => {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "leolem-sync-"));

  const from = path.join(tmp, ".content");
  const root = tmp;

  await writeFile(
    path.join(from, "content", "blog", "hello.md"),
    "---\ntitle: Hello\n---\nHi\n"
  );
  await writeFile(
    path.join(from, "assets", "blog", "hello.png"),
    Buffer.from([1, 2, 3, 4])
  );

  await writeFile(path.join(root, "src", "content", "blog", "hello.md"), "old\n");
  await writeFile(
    path.join(root, "src", "assets", "blog", "hello.png"),
    Buffer.from([9, 9, 9])
  );

  await sync(from, root, ["blog"]);

  const mdDst = path.join(root, "src", "content", "blog", "hello.md");
  const imgDst = path.join(root, "src", "assets", "blog", "hello.png");

  const [mdStat, imgStat] = await Promise.all([fs.stat(mdDst), fs.stat(imgDst)]);
  expect(mdStat.isFile()).toBe(true);
  expect(imgStat.isFile()).toBe(true);

  const md = await read(mdDst);
  expect(md.includes("title: Hello")).toBe(true);

  const [img, srcImg] = await Promise.all([
    fs.readFile(imgDst),
    fs.readFile(path.join(from, "assets", "blog", "hello.png")),
  ]);
  expect(img.equals(srcImg)).toBe(true);

  await fs.rm(tmp, { recursive: true, force: true });
});

test("sync throws when .content/content is missing", async () => {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "leolem-sync-"));

  const from = path.join(tmp, ".content");
  const root = tmp;

  await fs.mkdir(from, { recursive: true });

  await expect(sync(from, root, ["blog"])).rejects.toThrow(/Missing content directory/);

  await fs.rm(tmp, { recursive: true, force: true });
});