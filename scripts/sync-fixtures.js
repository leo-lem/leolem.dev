import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

const contentDst = path.join(root, "src/content");
const contentSrc = path.join(contentDst, ".fixtures");

const assetsDst = path.join(root, "src/assets");
const assetsSrc = path.join(assetsDst, ".fixtures");

const rm = (p) => fs.rm(p, { recursive: true, force: true });
const exists = (p) => fs.access(p).then(() => true).catch(() => false);

const keepContent = new Set([".fixtures", "README.md", "config.ts"]);
const keepContentEntry = (name) => keepContent.has(name) || name.endsWith(".ts");

const keepAssets = new Set([".fixtures", "README.md"]);
const keepAssetsEntry = (name) => keepAssets.has(name);

async function wipe(dstDir, keepFn) {
  for (const e of await fs.readdir(dstDir, { withFileTypes: true })) {
    if (keepFn(e.name)) continue;
    await rm(path.join(dstDir, e.name));
  }
}

async function copyAll(srcDir, dstDir) {
  for (const e of await fs.readdir(srcDir, { withFileTypes: true })) {
    const s = path.join(srcDir, e.name);
    const d = path.join(dstDir, e.name);
    await rm(d);
    if (e.isDirectory()) await fs.cp(s, d, { recursive: true });
    else await fs.copyFile(s, d);
  }
}

async function main() {
  if (!(await exists(contentSrc))) throw new Error(`Missing: ${contentSrc}`);

  await wipe(contentDst, keepContentEntry);
  await copyAll(contentSrc, contentDst);

  // assets fixtures are optional, but if present we sync them too
  if (await exists(assetsSrc)) {
    await wipe(assetsDst, keepAssetsEntry);
    await copyAll(assetsSrc, assetsDst);
  }

  console.log("synced fixtures");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});