import fs from 'fs';
const h = fs.readFileSync('../temp-homepage.html', 'utf8');
const imgs = [...h.matchAll(/https:\/\/demo2\.themelexus\.com\/bocpak\/wp-content\/uploads\/[^"'\s)]+/g)].map((m) => m[0]);
fs.writeFileSync('scripts/images-list.txt', [...new Set(imgs)].sort().join('\n'));
console.log('Found', new Set(imgs).size, 'images');
