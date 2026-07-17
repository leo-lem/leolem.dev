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

test("sync copies blog category and portfolio content/assets from .content into src", async () => {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "leolem-sync-"));

  const from = path.join(tmp, ".content");
  const root = tmp;

  await writeFile(path.join(from, "engineering", "hello.md"), "---\ntitle: Hello\n---\nHi\n");
  await writeFile(path.join(from, "engineering", "hello.png"), Buffer.from([1, 2, 3, 4]));
  await writeFile(path.join(from, "engineering", "world.mdx"), "---\ntitle: World\n---\nHi\n");

  await writeFile(path.join(from, "portfolio", "sample.md"), "---\ntitle: Sample\n---\nHi\n");
  await writeFile(path.join(from, "portfolio", "sample.png"), Buffer.from([5, 6, 7, 8]));
  await writeFile(path.join(from, "portfolio", "sample", "1.avif"), Buffer.from([9, 9, 9]));

  await writeFile(
    path.join(root, "src", "content", "blog", "engineering", "hello.md"),
    "old\n"
  );

  await sync(from, root);

  const mdDst = path.join(root, "src", "content", "blog", "engineering", "hello.md");
  const imgDst = path.join(root, "src", "assets", "blog", "engineering", "hello.png");

  const [mdStat, imgStat] = await Promise.all([fs.stat(mdDst), fs.stat(imgDst)]);
  expect(mdStat.isFile()).toBe(true);
  expect(imgStat.isFile()).toBe(true);

  const md = await read(mdDst);
  expect(md.includes("title: Hello")).toBe(true);

  const mdxDst = path.join(root, "src", "content", "blog", "engineering", "world.mdx");
  const mdxStat = await fs.stat(mdxDst);
  expect(mdxStat.isFile()).toBe(true);

  const portfolioMdDst = path.join(root, "src", "content", "portfolio", "sample.md");
  const portfolioImgDst = path.join(root, "src", "assets", "portfolio", "sample.png");
  const galleryDst = path.join(root, "src", "assets", "portfolio", "sample", "1.avif");

  const [portfolioMdStat, portfolioImgStat, galleryStat] = await Promise.all([
    fs.stat(portfolioMdDst),
    fs.stat(portfolioImgDst),
    fs.stat(galleryDst),
  ]);
  expect(portfolioMdStat.isFile()).toBe(true);
  expect(portfolioImgStat.isFile()).toBe(true);
  expect(galleryStat.isFile()).toBe(true);

  await fs.rm(tmp, { recursive: true, force: true });
});

test("sync throws when the content directory is missing", async () => {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "leolem-sync-"));

  const from = path.join(tmp, ".content");
  const root = tmp;

  await expect(sync(from, root)).rejects.toThrow(/Missing content directory/);

  await fs.rm(tmp, { recursive: true, force: true });
});
