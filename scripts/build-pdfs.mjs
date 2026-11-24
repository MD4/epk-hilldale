// Prints the one-sheets and tech sheets to public/downloads/.
// Run `npm run pdfs` after any content change, then commit the PDFs.
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { chromium } from '@playwright/test';
import { serveDist } from './serve-dist.mjs';

const PORT = 4398;
const SHEETS = [
  ['fr/onesheet/', 'hilldale-onesheet-fr.pdf'],
  ['en/onesheet/', 'hilldale-onesheet-en.pdf'],
  ['fr/tech/', 'hilldale-fiche-technique.pdf'],
  ['en/tech/', 'hilldale-tech-rider.pdf'],
];

execFileSync('npx', ['astro', 'build'], { stdio: 'inherit' });
mkdirSync('public/downloads', { recursive: true });

const server = await serveDist(PORT);
const browser = await chromium.launch();
try {
  for (const [route, file] of SHEETS) {
    const page = await browser.newPage();
    await page.goto(`http://localhost:${PORT}/${route}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({ path: `public/downloads/${file}`, format: 'A4', printBackground: true, preferCSSPageSize: true });
    await page.close();
    console.log(`Wrote public/downloads/${file}`);
  }
} finally {
  await browser.close();
  server.close();
}
