import { favicons } from "favicons";
import fs from "fs/promises";

const source = "src/assets/icon.jpg";
const outputDir = "public";

const response = await favicons(source, {
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

await Promise.all(
  response.images.map(img =>
    fs.writeFile(`${outputDir}/${img.name}`, img.contents)
  )
);

await Promise.all(
  response.files.map(file =>
    fs.writeFile(`${outputDir}/${file.name}`, file.contents)
  )
);

console.log("Icons generated.");