import { expect, test, type Page } from '@playwright/test';
import sharp from 'sharp';

const SITE = 'https://hilldale.band';
const meta = (page: Page, key: string) =>
  page.locator(`meta[property="${key}"], meta[name="${key}"]`).first().getAttribute('content');
const local = (url: string) => new URL(url).pathname;

for (const [lang, other, locale, otherLocale] of [
  ['fr', 'en', 'fr_FR', 'en_GB'],
  ['en', 'fr', 'en_GB', 'fr_FR'],
] as const) {
  test.describe(`/${lang}/`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/${lang}/`);
    });

    test('the title names the band and the genre', async ({ page }) => {
      await expect(page).toHaveTitle(/^HILLDALE · Dark hardcore/);
      const description = (await meta(page, 'description'))!;
      expect(description.length).toBeGreaterThan(70);
      expect(description.length).toBeLessThanOrEqual(160);
    });

    test('Open Graph describes the page for link previews', async ({ page }) => {
      expect(await meta(page, 'og:type')).toBe('website');
      expect(await meta(page, 'og:site_name')).toBe('HILLDALE');
      expect(await meta(page, 'og:url')).toBe(`${SITE}/${lang}/`);
      expect(await meta(page, 'og:locale')).toBe(locale);
      expect(await meta(page, 'og:locale:alternate')).toBe(otherLocale);
      expect(await meta(page, 'og:image:alt')).toBeTruthy();
      expect(await meta(page, 'og:image:width')).toBe('1200');
      expect(await meta(page, 'og:image:height')).toBe('630');
    });

    test('the share image is a 1200 × 630 JPEG', async ({ page, request }) => {
      const url = (await meta(page, 'og:image'))!;
      const response = await request.get(local(url));
      expect(response.headers()['content-type']).toBe('image/jpeg');
      const { width, height } = await sharp(await response.body()).metadata();
      expect([width, height]).toEqual([1200, 630]);
    });

    test('Twitter / X gets a large card', async ({ page }) => {
      expect(await meta(page, 'twitter:card')).toBe('summary_large_image');
      expect(await meta(page, 'twitter:title')).toBeTruthy();
      expect(await meta(page, 'twitter:image')).toBe(await meta(page, 'og:image'));
    });

    test('other languages and a default are declared', async ({ page }) => {
      await expect(page.locator(`link[rel=alternate][hreflang=${other}]`)).toHaveAttribute('href', `${SITE}/${other}/`);
      await expect(page.locator('link[rel=alternate][hreflang=x-default]')).toHaveAttribute('href', `${SITE}/en/`);
    });

    test('structured data describes the band', async ({ page }) => {
      const data = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
      expect(data['@context']).toBe('https://schema.org');
      expect(data['@type']).toBe('MusicGroup');
      expect(data.name).toBe('HILLDALE');
      expect(data.url).toBe(`${SITE}/${lang}/`);
      expect(data.foundingLocation.name).toContain('Nantes');
      expect(data.member).toHaveLength(4);
      expect(data.email).toBe('hilldaledowntempo44@gmail.com');
      expect(data.sameAs).toEqual(expect.arrayContaining([
        'https://www.instagram.com/hilldale_band/',
        'https://hilldale44.bandcamp.com/album/hilldale',
      ]));
      expect(data.album).toMatchObject({ '@type': 'MusicAlbum', name: 'Hilldale', datePublished: '2025-10-31' });
      const today = new Date().toISOString().slice(0, 10);
      for (const event of data.event ?? []) {
        expect(event['@type']).toBe('MusicEvent');
        expect(event.startDate >= today).toBe(true);
        expect(event.location.address.addressLocality).toBeTruthy();
      }
    });
  });
}

test('a web app manifest names the band and its icons', async ({ page, request }) => {
  await page.goto('/en/');
  const href = (await page.locator('link[rel="manifest"]').getAttribute('href'))!;
  const manifest = await (await request.get(href)).json();
  expect(manifest.name).toContain('HILLDALE');
  expect(manifest.start_url).toBe('/');
  const sizes = manifest.icons.map((i: { sizes: string }) => i.sizes);
  expect(sizes).toEqual(expect.arrayContaining(['192x192', '512x512']));
  expect(manifest.icons.some((i: { purpose?: string }) => i.purpose === 'maskable')).toBe(true);
  for (const icon of manifest.icons) {
    const response = await request.get(icon.src);
    expect(response.headers()['content-type'], icon.src).toBe('image/png');
    const { width } = await sharp(await response.body()).metadata();
    expect(`${width}x${width}`).toBe(icon.sizes);
  }
});

test('a sitemap lists both languages with their alternates', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  expect(xml).toContain(`<loc>${SITE}/fr/</loc>`);
  expect(xml).toContain(`<loc>${SITE}/en/</loc>`);
  expect(xml).toContain(`hreflang="x-default" href="${SITE}/en/"`);
});
