import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const i = process.argv.indexOf("--from");
const from = path.resolve(root, i === -1 ? ".content" : process.argv[i + 1]);

const collections = ["blog", "portfolio", "offering"];
const exists = (p) => fs.access(p).then(() => true).catch(() => false);

if (!(await exists(path.join(from, "content")))) throw new Error("Missing content/");

for (const name of collections) {
  const src = path.join(from, "content", name);
  const dst = path.join(root, "src", "content", name);
  if (await exists(src)) {
    await fs.mkdir(dst, { recursive: true });
    await fs.cp(src, dst, { recursive: true, force: true });
  }
}

for (const name of collections) {
  const src = path.join(from, "assets", name);
  const dst = path.join(root, "src", "assets", name);
  if (await exists(src)) {
    await fs.mkdir(dst, { recursive: true });
    await fs.cp(src, dst, { recursive: true, force: true });
  }
}

console.log(`Merged ${collections.join(", ")} from ${from}`);