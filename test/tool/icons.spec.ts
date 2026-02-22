import { test, expect } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";

import icons from "../../tool/icons";

test.describe.configure({ mode: "serial" });

async function existsNonEmpty(filePath: string) {
  const st = await fs.stat(filePath);
  expect(st.isFile()).toBe(true);
  expect(st.size).toBeGreaterThan(0);
}

test("icons tool populates public outputs in a temp root", async () => {
  const repoRoot = process.cwd();
  const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), "leolem-icons-"));

  try {
    await fs.mkdir(path.join(tmpRoot, "src", "assets"), { recursive: true });

    await Promise.all([
      fs.copyFile(
        path.join(repoRoot, "src", "assets", "profile.jpg"),
        path.join(tmpRoot, "src", "assets", "profile.jpg")
      ),
      fs.copyFile(
        path.join(repoRoot, "src", "assets", "about.png"),
        path.join(tmpRoot, "src", "assets", "about.png")
      ),
    ]);

    await icons("src/assets/about.png", "src/assets/profile.jpg", tmpRoot);

    const faviconIco = path.join(tmpRoot, "public", "favicon.ico");
    const socialPng = path.join(tmpRoot, "public", "social.png");

    await existsNonEmpty(faviconIco);
    await existsNonEmpty(socialPng);

    const [actualSocial, expectedSocial] = await Promise.all([
      fs.readFile(socialPng),
      fs.readFile(path.join(tmpRoot, "src", "assets", "about.png")),
    ]);

    expect(actualSocial.equals(expectedSocial)).toBe(true);
  } finally {
    await fs.rm(tmpRoot, { recursive: true, force: true });
  }
});