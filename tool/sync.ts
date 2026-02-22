import fs from "node:fs/promises";
import path from "node:path";

import { exists, isExecuted } from "./lib";

export default async function sync(
  from: string = ".content",
  root: string = process.cwd(),
  collections: string[] = ["blog", "portfolio", "offering"]
) {
  if (!(await exists(path.join(from, "content"))))
    throw new Error("Missing content directory");

  for (const name of collections) {
    const content = path.join(from, "content", name);
    if (await exists(content)) {
      const destination = path.join(root, "src", "content", name);
      await fs.mkdir(destination, { recursive: true });
      await fs.cp(content, destination, { recursive: true, force: true });
    }

    const asset = path.join(from, "assets", name);
    if (await exists(asset)) {
      const destination = path.join(root, "src", "assets", name);
      await fs.mkdir(destination, { recursive: true });
      await fs.cp(asset, destination, { recursive: true, force: true });
    }
  }

  console.log(`Merged ${collections.join(", ")} from ${from}`);
}

if (isExecuted(import.meta.url))
  await sync();