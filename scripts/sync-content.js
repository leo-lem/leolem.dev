import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

const argIndex = process.argv.indexOf("--from");
const fromArg = argIndex === -1 ? "_content" : process.argv[argIndex + 1];
if (!fromArg) {
  console.error("Missing value for --from");
  process.exit(1);
}

const from = path.isAbsolute(fromArg) ? fromArg : path.join(root, fromArg);

const srcContent = path.join(from, "content");
const srcAssets = path.join(from, "assets");

const dstContent = path.join(root, "src", "content");
const dstAssets = path.join(root, "src", "assets");

// Keep these in src/content (schemas + docs + fixtures)
const keepContentNames = new Set([".fixtures", "README.md", "config.ts"]);
const keepContentEntry = (name) => keepContentNames.has(name) || name.endsWith(".ts");

// Keep these in src/assets (docs + fixtures)
const keepAssetsNames = new Set([".fixtures", "README.md"]);
const keepAssetsEntry = (name) => keepAssetsNames.has(name);

const exists = async (p) => fs.access(p).then(() => true).catch(() => false);
const rm = async (p) => fs.rm(p, { recursive: true, force: true });

async function wipeFolderExcept(dstDir, keepFn) {
  const entries = await fs.readdir(dstDir, { withFileTypes: true });
  for (const e of entries) {
    if (keepFn(e.name)) continue;
    await rm(path.join(dstDir, e.name));
  }
}

async function copyAll(srcDir, dstDir) {
  const entries = await fs.readdir(srcDir, { withFileTypes: true });
  for (const e of entries) {
    const s = path.join(srcDir, e.name);
    const d = path.join(dstDir, e.name);

    await rm(d);

    if (e.isDirectory()) {
      await fs.cp(s, d, { recursive: true });
    } else {
      await fs.copyFile(s, d);
    }
  }
}

async function main() {
  if (!(await exists(srcContent))) {
    throw new Error(`Missing content source folder: ${srcContent}`);
  }

  // Sync content
  await wipeFolderExcept(dstContent, keepContentEntry);
  await copyAll(srcContent, dstContent);

  // Sync assets (optional but expected)
  if (await exists(srcAssets)) {
    await wipeFolderExcept(dstAssets, keepAssetsEntry);
    await copyAll(srcAssets, dstAssets);
  }

  console.log(`Synced content/assets from ${from}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});