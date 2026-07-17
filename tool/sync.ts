import fs from "node:fs/promises";
import path from "node:path";

import { exists, isExecuted } from "./lib";

const imageExtensions = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".avif",
  ".webp",
  ".gif",
  ".svg",
]);

export default async function sync(
  from: string = ".content",
  root: string = process.cwd()
) {
  if (!(await exists(from))) throw new Error("Missing content directory");

  const entries = await fs.readdir(from, { withFileTypes: true });
  const categories = entries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => entry.name);

  if (categories.length === 0) throw new Error("Missing content directory");

  for (const category of categories) {
    const collection = category === "portfolio" ? "portfolio" : "blog";
    const sub = category === "portfolio" ? "" : category;

    const contentDestination = path.join(root, "src", "content", collection, sub);
    const assetDestination = path.join(root, "src", "assets", collection, sub);

    await fs.mkdir(contentDestination, { recursive: true });
    await fs.mkdir(assetDestination, { recursive: true });

    const items = await fs.readdir(path.join(from, category), { withFileTypes: true });
    for (const item of items) {
      const source = path.join(from, category, item.name);

      if (item.isDirectory()) {
        await fs.cp(source, path.join(assetDestination, item.name), {
          recursive: true,
          force: true,
        });
      } else if (item.name.endsWith(".md")) {
        await fs.copyFile(source, path.join(contentDestination, item.name));
      } else if (imageExtensions.has(path.extname(item.name).toLowerCase())) {
        await fs.copyFile(source, path.join(assetDestination, item.name));
      }
    }
  }

  console.log(`Merged ${categories.join(", ")} from ${from}`);
}

if (isExecuted(import.meta.url)) await sync();
