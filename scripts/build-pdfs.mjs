// Second step of `npm run build`: prints the one-sheets and tech sheets from the freshly
// built print pages straight into dist/downloads/, where the next step packs them into the ZIP.
import { mkdirSync } from 'node:fs';
import { chromium } from '@playwright/test';
import { serveDist } from './serve-dist.mjs';

const PORT = 4398;
const BASE = (process.env.BASE_PATH || '').replace(/\/$/, '') + '/';
const SHEETS = [
  ['fr/onesheet/', 'hilldale-onesheet-fr.pdf'],
  ['en/onesheet/', 'hilldale-onesheet-en.pdf'],
  ['fr/tech/', 'hilldale-fiche-technique.pdf'],
  ['en/tech/', 'hilldale-tech-rider.pdf'],
];

const OUT = 'dist/downloads';
mkdirSync(OUT, { recursive: true });

const server = await serveDist(PORT);
const browser = await chromium.launch();
try {
  for (const [route, file] of SHEETS) {
    const page = await browser.newPage();
    await page.goto(`http://localhost:${PORT}${BASE}${route}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({ path: `${OUT}/${file}`, format: 'A4', printBackground: true, preferCSSPageSize: true });
    await page.close();
    console.log(`Wrote ${OUT}/${file}`);
  }
} finally {
  await browser.close();
  server.close();
}
