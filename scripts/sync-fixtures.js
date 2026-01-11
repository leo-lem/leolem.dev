import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dst = path.join(root, "src/content");
const src = path.join(dst, ".fixtures");

const keep = new Set([".fixtures", "README.md", "config.ts"]);
const keepFile = (name) => keep.has(name) || name.endsWith(".ts");

const rm = (p) => fs.rm(p, { recursive: true, force: true });

const copyEntry = async (from, to, dirent) => {
  await rm(to);
  if (dirent.isDirectory()) return fs.cp(from, to, { recursive: true });
  return fs.copyFile(from, to);
};

const main = async () => {
  // wipe generated entries in src/content
  for (const e of await fs.readdir(dst, { withFileTypes: true })) {
    if (keepFile(e.name)) continue;
    await rm(path.join(dst, e.name));
  }

  // copy fixtures into src/content
  for (const e of await fs.readdir(src, { withFileTypes: true })) {
    await copyEntry(path.join(src, e.name), path.join(dst, e.name), e);
  }

  console.log("synced fixtures");
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});