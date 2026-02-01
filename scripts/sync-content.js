import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const i = process.argv.indexOf("--from");
const from = path.resolve(root, i === -1 ? "_content" : process.argv[i + 1]);

const collections = ["blog", "portfolio", "offering"];
const exists = (p) => fs.access(p).then(() => true).catch(() => false);

const sync = async (base, dstBase, name) => {
  const src = path.join(from, base, name);
  if (!(await exists(src))) return;

  const dst = path.join(root, dstBase, name);
  await fs.rm(dst, { recursive: true, force: true });
  await fs.mkdir(path.dirname(dst), { recursive: true });
  await fs.cp(src, dst, { recursive: true, force: true });
};

if (!(await exists(path.join(from, "content")))) throw new Error("Missing content/");

await Promise.all(
  collections.flatMap((name) => [
    sync("content", "src/content", name),
    sync("assets", "src/assets", name),
  ])
);

console.log(`Synced ${collections.join(", ")} from ${from}`);