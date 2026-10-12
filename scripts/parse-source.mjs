import fs from "fs";

const html = fs.readFileSync("scripts/source.html", "utf8");

const imgs = [...html.matchAll(/https:\/\/demo2\.themelexus\.com\/bocpak\/wp-content\/uploads\/[^"'\s)]+/g)]
  .map((m) => m[0])
  .filter((u) => /\.(jpg|jpeg|png|webp|svg)(\?|$)/i.test(u));

const unique = [...new Set(imgs)].sort();
fs.writeFileSync("scripts/all-images.txt", unique.join("\n"));
console.log("images:", unique.length);

const navMatch = html.match(/menu-item[^>]*>[\s\S]*?<\/nav>/gi);
if (navMatch) console.log("nav chunks", navMatch.length);

// slider bg urls from SR7 JSON
const sliderJson = html.match(/SR7\.JSON\['SR7_1_1'\]\s*=\s*(\{[\s\S]*?\});/);
if (sliderJson) {
  const slideImgs = [...sliderJson[1].matchAll(/uploads\/[^"\\]+/g)].map((m) => m[0]);
  console.log("slider assets:", [...new Set(slideImgs)].slice(0, 20));
}

// product images
const productImgs = [...html.matchAll(/woocommerce-loop-product[\s\S]*?src="([^"]+)"/g)].map((m) => m[1]);
console.log("product imgs sample:", productImgs.slice(0, 5));

// service images  
const serviceImgs = [...html.matchAll(/services-01[\s\S]{0,500}?uploads\/[^"']+/g)].slice(0,3);
console.log("service", serviceImgs);

// header phone / topbar
const phone = html.match(/\+1[\d\s-]+/g);
console.log("phones", phone?.slice(0,5));

// menu items text
const menuItems = [...html.matchAll(/menu-item-type-custom[^>]*>[\s\S]*?<a[^>]*>([^<]+)</g)].map(m => m[1].trim());
console.log("menu", [...new Set(menuItems)].slice(0,15));
