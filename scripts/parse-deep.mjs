import fs from "fs";
const html = fs.readFileSync("scripts/source.html", "utf8");

// extract menu-main items
const mainMenu = [...html.matchAll(/menu-main-menu[\s\S]*?<\/ul>/)[0]?.[0].matchAll(/<a[^>]*>([^<]+)</g) || []].map(m => m[1].replace(/&#8211;/g, '-').trim());

// product images in order
const productImgs = [...html.matchAll(/class="[^"]*woocommerce-loop-product[\s\S]*?src="(https:\/\/demo2[^"]+product[^"]+)"/g)].map(m => m[1]);

// category names with subs from homepage categories section
const catBlocks = [...html.matchAll(/category-product-img[\s\S]*?cat-0(\d)\.jpg[\s\S]*?category-count">(\d+)</g)];

// service card images
const serviceCards = [...html.matchAll(/services-01[\s\S]{0,2000}?src="(https:\/\/demo2[^"]+\.jpg)"/g)].map(m => m[1]);

// hero bg from revslider
const heroBg = [...html.matchAll(/revslider[^"']*|slider[^"']*\.jpg|h1[^"']*\.jpg/gi)].slice(0,20);

// banner images in header
const headerBanner = [...html.matchAll(/bocpak-banner[\s\S]{0,800}?url\(([^)]+)\)/g)].map(m => m[1]);

// testimonial avatars
const testimonialImgs = [...html.matchAll(/testimonial[\s\S]{0,500}?src="([^"]+)"/gi)].map(m => m[1]).slice(0,10);

// perfect packaging section images
const perfectSection = html.match(/Perfect packaging every time[\s\S]{0,8000}/i)?.[0] || '';

// eco section bg
const ecoImgs = [...html.matchAll(/Eco-Friendly[\s\S]{0,5000}?src="([^"]+)"/gi)].map(m => m[1]);

// go green
const goGreen = [...html.matchAll(/Go green[\s\S]{0,5000}?src="([^"]+)"/gi)].map(m => m[1]);

// special offer
const offer = [...html.matchAll(/Special offer[\s\S]{0,5000}?src="([^"]+)"/gi)].map(m => m[1]);

// features icons section
const featureSection = html.match(/Eco-Friendly Packaging[\s\S]{0,3000}/)?.[0];

const out = {
  mainMenu: mainMenu.slice(0, 20),
  productImgs: [...new Set(productImgs)],
  serviceCards: [...new Set(serviceCards)],
  headerBanner: [...new Set(headerBanner)],
  testimonialImgs: [...new Set(testimonialImgs)],
  ecoImgs: [...new Set(ecoImgs)],
  goGreen: [...new Set(goGreen)],
  offer: [...new Set(offer)],
};

// all jpg/png in 2024/05 sorted
const all05 = [...html.matchAll(/uploads\/2024\/05\/([a-zA-Z0-9._-]+\.(?:jpg|png|webp|svg))/g)].map(m => m[1]);
out.all05unique = [...new Set(all05)].sort();

fs.writeFileSync("scripts/parsed.json", JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2).slice(0, 8000));
