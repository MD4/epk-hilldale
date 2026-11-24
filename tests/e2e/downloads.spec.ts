import { execFileSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const ZIP = 'dist/downloads/hilldale-presskit.zip';
const PHOTOS = ['01', '09', '10', '12'].map((n) => `photos/hilldale-promo-${n}.jpg`);
const LOGOS = ['symbol-black', 'symbol-white', 'wordmark-black', 'wordmark-white'].map(
  (n) => `logos/hilldale-${n}.png`,
);
const BIOS = ['bio/hilldale-bio-en.txt', 'bio/hilldale-bio-fr.txt'];
export const PDFS = [
  'hilldale-fiche-technique.pdf',
  'hilldale-onesheet-en.pdf',
  'hilldale-onesheet-fr.pdf',
  'hilldale-tech-rider.pdf',
];

const zipEntries = () =>
  execFileSync('unzip', ['-Z1', ZIP], { encoding: 'utf8' })
    .split('\n')
    .filter((line) => line && !line.endsWith('/'))
    .sort();

test('every download link on the page works', async ({ page, request }) => {
  await page.goto('/fr/');
  const hrefs = await page
    .locator('a[href^="/downloads/"]')
    .evaluateAll((links) => [...new Set(links.map((a) => a.getAttribute('href')!))]);
  expect(hrefs.length).toBeGreaterThanOrEqual(9);
  for (const href of hrefs.filter((h) => PDFS.length > 0 || !h.endsWith('.pdf'))) {
    expect((await request.get(href)).status(), href).toBe(200);
  }
});

test('photo downloads are the untouched originals', async ({ request }) => {
  for (const photo of PHOTOS) {
    const response = await request.get(`/downloads/${photo}`);
    expect(response.headers()['content-type']).toBe('image/jpeg');
    expect((await response.body()).length, photo).toBeGreaterThan(5_000_000);
  }
});

test('the ZIP holds exactly the photos, logos, bios and PDFs', () => {
  expect(zipEntries()).toEqual([...PHOTOS, ...LOGOS, ...BIOS, ...PDFS].sort());
});

test('nothing private is published', () => {
  const published = readdirSync('dist', { recursive: true }).map(String);
  for (const path of [...published, ...zipEntries()]) {
    expect(path.toLowerCase()).not.toContain('private');
  }
});

test('the French bio file carries the French short bio', async ({ page }) => {
  await page.goto('/fr/');
  const shortBio = await page.locator('[data-bio="short"]').evaluate((el) => el.textContent!.trim());
  const text = execFileSync('unzip', ['-p', ZIP, 'bio/hilldale-bio-fr.txt'], { encoding: 'utf8' });
  expect(text).toContain(shortBio);
});
