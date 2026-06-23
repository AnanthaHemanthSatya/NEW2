const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const BILLI_DIR = path.join(ROOT, 'assets', 'photos', 'billi');
const ME_DIR = path.join(ROOT, 'assets', 'photos', 'me');
const OUT = path.join(ROOT, 'js', 'photos-data.js');

const SLOTS = [
  { key: 'billi-01', file: '01-childhood.jpg', dir: BILLI_DIR },
  { key: 'billi-02', file: '02-restaurant.jpg', dir: BILLI_DIR },
  { key: 'billi-03', file: '03-siblings.jpg', dir: BILLI_DIR },
  { key: 'billi-04', file: '04-aesthetic.jpg', dir: BILLI_DIR },
  { key: 'billi-05', file: '05-white-hearts.jpg', dir: BILLI_DIR },
  { key: 'billi-06', file: '06-flower-filter.jpg', dir: BILLI_DIR },
  { key: 'billi-07', file: '07-blazer.jpg', dir: BILLI_DIR },
  { key: 'billi-08', file: '08-with-baby.jpg', dir: BILLI_DIR },
  { key: 'billi-09', file: '09-calligraphy.jpg', dir: BILLI_DIR },
  { key: 'billi-10', file: '10-mirror.jpg', dir: BILLI_DIR },
  { key: 'billi-11', file: '11-blue-polo.jpg', dir: BILLI_DIR },
  { key: 'billi-12', file: '12-pout.jpg', dir: BILLI_DIR },
  { key: 'billi-13', file: '13-sleeping.jpg', dir: BILLI_DIR },
  { key: 'billi-14', file: '14-red-sari.jpg', dir: BILLI_DIR },
  { key: 'billi-15', file: '15-stairs.jpg', dir: BILLI_DIR },
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
