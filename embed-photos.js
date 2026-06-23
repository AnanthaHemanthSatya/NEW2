const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const BILLI_DIR = path.join(ROOT, 'assets', 'photos', 'billi');
const ME_DIR = path.join(ROOT, 'assets', 'photos', 'me');
const OUT = path.join(ROOT, 'js', 'photos-data.js');

const SLOTS = [
  { key: 'billi-01', file: 'little-billi-spiderman-bed.jpg', dir: BILLI_DIR },
  { key: 'billi-02', file: 'restaurant-pout-waiting.jpg', dir: BILLI_DIR },
  { key: 'billi-03', file: 'siblings-selfie.jpg', dir: BILLI_DIR },
  { key: 'billi-04', file: 'aesthetic-soft-portrait.jpg', dir: BILLI_DIR },
  { key: 'billi-05', file: 'favourite-hearts-tulips.jpg', dir: BILLI_DIR },
  { key: 'billi-06', file: 'flower-filter-rose-pillow.jpg', dir: BILLI_DIR },
  { key: 'billi-07', file: 'blue-polo-plaid-blazer.jpg', dir: BILLI_DIR },
  { key: 'billi-08', file: 'gentle-heart-with-baby.jpg', dir: BILLI_DIR },
  { key: 'billi-09', file: 'calligraphy-wall-from-behind.jpg', dir: BILLI_DIR },
  { key: 'billi-10', file: 'mirror-selfie-elegant.jpg', dir: BILLI_DIR },
  { key: 'billi-11', file: 'blue-polo-floral-pillow.jpg', dir: BILLI_DIR },
  { key: 'billi-12', file: 'cute-pout-lavender.jpg', dir: BILLI_DIR },
  { key: 'billi-13', file: 'sleepy-resting-moment.jpg', dir: BILLI_DIR },
  { key: 'billi-14', file: 'little-red-traditional.jpg', dir: BILLI_DIR },
  { key: 'billi-15', file: 'stairs-aesthetic-pose.jpg', dir: BILLI_DIR },
  { key: 'me-01', file: '01-motorcycle.jpg', dir: ME_DIR },
  { key: 'me-02', file: '02-outdoors.jpg', dir: ME_DIR },
  { key: 'me-03', file: '03-bike-angle.jpg', dir: ME_DIR },
];

const data = {};
let count = 0;

for (const slot of SLOTS) {
  const filePath = path.join(slot.dir, slot.file);
  if (!fs.existsSync(filePath)) continue;
  const buf = fs.readFileSync(filePath);
  const ext = path.extname(slot.file).toLowerCase();
  const mime = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
  data[slot.key] = `data:${mime};base64,${buf.toString('base64')}`;
  count++;
}

fs.writeFileSync(OUT, `window.PHOTOS_DATA = ${JSON.stringify(data, null, 2)};\n`);
console.log(`Embedded ${count} photos into js/photos-data.js`);
