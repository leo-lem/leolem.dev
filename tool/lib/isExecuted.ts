import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export default function isExecuted(metaUrl: string): boolean {
  const self = fs.realpathSync(fileURLToPath(metaUrl));

  for (const arg of process.argv.slice(1)) {
    if (!arg || arg.startsWith("-")) continue;

    const cleaned = arg.replace(/^file:\/\//, "").split("?")[0].split("#")[0];
    if (!/\.(mjs|cjs|js|mts|cts|ts)$/.test(cleaned)) continue;

    const candidate = path.isAbsolute(cleaned)
      ? cleaned
      : path.resolve(process.cwd(), cleaned);

    try {
      const real = fs.realpathSync(candidate);
      if (real === self) return true;
    } catch {
      continue;
    }
  }

  return false;
}