import { existsSync, readFileSync, statSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { PDFDocument } from 'pdf-lib';

const EMAIL = 'hilldaledowntempo44@gmail.com';

test('the French one-sheet carries the essentials', async ({ page }) => {
  await page.goto('/fr/');
  const shortBio = await page.locator('[data-bio="short"]').evaluate((el) => el.textContent!.trim());
  await page.goto('/fr/onesheet/');
  const sheet = page.locator('main');
  await expect(sheet).toContainText('Dark hardcore de Nantes');
  await expect(sheet).toContainText(shortBio);
  await expect(sheet).toContainText('Un hardcore sombre et viscéral');
  await expect(sheet).toContainText('bastonne.fr');
  await expect(sheet).toContainText(EMAIL);
  await expect(sheet.locator('[data-qr] svg')).toBeVisible();
});

test('the one-sheet leaves out empty optional content', async ({ page }) => {
  await page.goto('/en/onesheet/');
  await expect(page.locator('[data-field="fans-of"]')).toHaveCount(0);
});

test('the one-sheet lists shows and names itself plainly', async ({ page }) => {
  await page.goto('/en/onesheet/');
  await expect(page.locator('[data-shows] li').first()).toBeVisible();
  await expect(page).toHaveTitle('HILLDALE · One-sheet');
  await expect(page.locator('main')).toContainText('Dark, visceral hardcore');
});

test('the English tech rider has the patch list, the stage plot and its date', async ({ page }) => {
  await page.goto('/en/tech/');
  await expect(page.locator('table[data-patch] tbody tr')).toHaveCount(13);
  const plot = page.locator('svg[data-plot]');
  for (const name of ['Suli', 'Jojo', 'Leo', 'Marty']) await expect(plot).toContainText(name);
  await expect(page.locator('[data-updated]')).toContainText(/\d{2}\.\d{2}\.\d{4}/);
  await expect(page.locator('[data-field="set-length"]')).toHaveCount(0);
  await expect(page.locator('main')).not.toContainText(/(\+33|0)[1-9]([ .]?\d{2}){4}/);
});

for (const file of [
  'hilldale-onesheet-fr.pdf',
  'hilldale-onesheet-en.pdf',
  'hilldale-fiche-technique.pdf',
  'hilldale-tech-rider.pdf',
]) {
  test(`${file} is a single light page`, async () => {
    const path = `public/downloads/${file}`;
    expect(existsSync(path), `${path} is missing: run npm run pdfs`).toBe(true);
    const pdf = await PDFDocument.load(readFileSync(path));
    expect(pdf.getPageCount()).toBe(1);
    expect(statSync(path).size).toBeLessThan(3_000_000);
  });
}

for (const route of ['/fr/onesheet/', '/en/onesheet/', '/fr/tech/', '/en/tech/']) {
  test(`${route} fits its page with nothing cut off`, async ({ page }) => {
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    const overflow = await page
      .locator('.sheet')
      .evaluate((sheet) => Math.max(sheet.scrollHeight - sheet.clientHeight, ...[...sheet.querySelectorAll('*')].map((el) => el.getBoundingClientRect().bottom - sheet.getBoundingClientRect().bottom)));
    expect(overflow).toBeLessThanOrEqual(0);
  });
}
