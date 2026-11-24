// Renders public/favicon.svg into the PNG and ICO files older browsers and phones ask for.
// Run once after changing the SVG: node scripts/make-favicons.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const svg = readFileSync('public/favicon.svg');
const png = (size) => sharp(svg, { density: 384 }).resize(size, size).png().toBuffer();

writeFileSync('public/apple-touch-icon.png', await png(180));
writeFileSync('public/icon-192.png', await png(192));
writeFileSync('public/icon-512.png', await png(512));

// Phones crop "maskable" icons to a circle or a squircle, so the cross sits well inside the safe zone.
const maskable = svg
  .toString()
  .replace('rx="96" ', '')
  .replace('scale(0.36)', 'scale(0.27)');
writeFileSync('public/icon-maskable-512.png', await sharp(Buffer.from(maskable), { density: 384 }).resize(512, 512).png().toBuffer());

// An .ico file is a small header followed by PNG images, one per size.
const images = await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await png(size) })));
const header = Buffer.alloc(6 + 16 * images.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(images.length, 4);
let offset = header.length;
images.forEach(({ size, data }, i) => {
  const entry = 6 + 16 * i;
  header.writeUInt8(size, entry);
  header.writeUInt8(size, entry + 1);
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(data.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += data.length;
});
writeFileSync('public/favicon.ico', Buffer.concat([header, ...images.map((i) => i.data)]));
console.log('Wrote the PNG icons and public/favicon.ico');
