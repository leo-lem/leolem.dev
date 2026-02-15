import { favicons } from "favicons";
import fs from "node:fs/promises";

const response = await favicons("src/assets/profile.jpg", {
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
    yandex: false
  },
});

for (const {name, contents} of response.images)
  await fs.writeFile(`public/${name}`, contents);
for (const {name, contents} of response.files)
  await fs.writeFile(`public/${name}`, contents);
await fs.copyFile("src/assets/thumbnail.png", `public/social.png`);

console.log("Public has been populated with icons and social image.");