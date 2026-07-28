import fs from "node:fs/promises";
import path from "node:path";

// src/content/blog is gitignored (synced from the private content repo), so it's
// safe to drop throwaway fixture posts in here for tests that need several
// articles without depending on real synced content being checked out.
function fixturesDir(namespace: string) {
  return path.join(process.cwd(), "src/content/blog", `_fixtures-${namespace}`);
}

export async function seedBlogFixtures(namespace: string, count: number): Promise<void> {
  const dir = fixturesDir(namespace);
  await fs.mkdir(dir, { recursive: true });

  for (let i = 0; i < count; i++) {
    const date = new Date(Date.UTC(2025, 0, i + 1)).toISOString().slice(0, 10);
    await fs.writeFile(
      path.join(dir, `post-${i}.md`),
      [
        "---",
        `title: Fixture Post ${i}`,
        "short: A fixture post generated for testing",
        `date: ${date}`,
        "tags: [Fixture]",
        "---",
        "",
        `Fixture content for post ${i}.`,
        ""
      ].join("\n")
    );
  }
}

export async function clearBlogFixtures(namespace: string): Promise<void> {
  await fs.rm(fixturesDir(namespace), { recursive: true, force: true });
}
