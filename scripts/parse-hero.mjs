import fs from "fs";
const html = fs.readFileSync("scripts/source.html", "utf8");
const m = html.match(/SR7\.JSON\['SR7_1_1'\]\s*=\s*(\{[\s\S]*?\});\s*SR7\.JSON/);
if (m) {
  const imgs = [...m[1].matchAll(/uploads\\\/[^"\\]+/g)].map((x) => x[0].replace(/\\\//g, "/"));
  console.log("hero imgs", [...new Set(imgs)]);
}

// service swiper images
const svc = [...html.matchAll(/elementor-widget-bocpak-services[\s\S]{0,3000}?src="([^"]+\.jpg)"/g)].map((x) => x[1]);
console.log("services", [...new Set(svc)]);

// all unique 2024/05 base names without size suffix
const bases = [...html.matchAll(/uploads\/2024\/05\/([a-z0-9-]+)\.(jpg|png|svg)/gi)]
  .map((x) => x[1] + "." + x[2].toLowerCase())
  .filter((n) => !n.match(/-\d+x\d+\./) && !n.includes("product-") || n.match(/^product-\d+-1\.jpg$/))
  .filter((n) => !/-\d+x\d+/.test(n));
console.log("base files", [...new Set(bases)].sort());

// product categories on cards
const cats = [...html.matchAll(/product-cat-list[^>]*>([^<]+)</g)].map((x) => x[1].trim());
console.log("product cats", cats.slice(0, 12));

// menu right items
const menuRight = [...html.matchAll(/menu-menu-right[\s\S]*?<\/ul>/)[0][0].matchAll(/menu-title">([^<]+)</g)].map((x) => x[1]);
console.log("menu right", menuRight);
