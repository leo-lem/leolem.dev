import { favicons } from "favicons";
import fs from "node:fs/promises";
import path from "node:path";

import { isExecuted } from "./lib";

export default async function icons(
  social: string = "src/assets/about.png",
  profile: string = "src/assets/profile.jpg",
  root: string = process.cwd()
) {
  const response = await favicons(path.join(root, profile), {
    path: "/",
    appName: "Leopold Lemmermann",
    appShortName: "leolem.dev",
    developerName: "Leopold Lemmermann",
    appDescription: "Portfolio, blog, and engineering notes",
    icons: {
      favicons: true,
      android: true,
      appleIcon: true,
      appleStartup: false,
      windows: false,
      yandex: false,
    },
  });

  await fs.mkdir(path.join(root, "public"), { recursive: true });

  for (const { name, contents } of response.images)
    await fs.writeFile(path.join(root, "public", name), contents);

  for (const { name, contents } of response.files)
    await fs.writeFile(path.join(root, "public", name), contents);

  await fs.copyFile(path.join(root, social), path.join(root, "public/social.png"));

  console.log("Public has been populated with icons and social image.");
}

if (isExecuted(import.meta.url))
  await icons();