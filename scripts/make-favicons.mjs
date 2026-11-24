// Renders public/favicon.svg into the PNG and ICO files older browsers and phones ask for.
// Run once after changing the SVG: node scripts/make-favicons.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const svg = readFileSync('public/favicon.svg');
const png = (size) => sharp(svg, { density: 384 }).resize(size, size).png().toBuffer();

writeFileSync('public/apple-touch-icon.png', await png(180));

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
console.log('Wrote public/apple-touch-icon.png and public/favicon.ico');
