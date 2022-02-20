const fs = require("fs");
const path = require("path");
var sizeOf = require("image-size");

const ICONS_DIR = "./public/icons";

const iconFiles = fs.readdirSync(ICONS_DIR).filter((v) => v.endsWith(".png"));

const icons = {};

for (const icon of iconFiles) {
  const iconPath = path.join(ICONS_DIR, icon);
  const dimensions = sizeOf(iconPath);

  if (dimensions.width !== dimensions.height) {
    console.warn(iconPath + " is not a square, skipping!!");
    continue;
  }

  icons[dimensions.width] = `icons/${icon}`;
}

console.log(icons);

const manifest = JSON.parse(fs.readFileSync("./public/manifest.json"));
manifest.icons = icons;
manifest.browser_action.default_icon = icons;

fs.writeFileSync("./public/manifest.json", JSON.stringify(manifest, null, 2));
