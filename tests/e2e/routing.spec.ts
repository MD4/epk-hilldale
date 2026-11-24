import { expect, test } from '@playwright/test';

for (const lang of ['fr', 'en'] as const) {
  const other = lang === 'fr' ? 'en' : 'fr';

  test(`/${lang}/ declares its language and has one h1`, async ({ page }) => {
    await page.goto(`/${lang}/`);
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await expect(page.locator('h1')).toHaveCount(1);
  });

  test(`/${lang}/ is hidden from search engines`, async ({ page }) => {
    await page.goto(`/${lang}/`);
    await expect(page.locator('meta[name=robots]')).toHaveAttribute('content', 'noindex');
  });

  test(`/${lang}/ points to its other language`, async ({ page }) => {
    await page.goto(`/${lang}/`);
    await expect(page.locator(`link[rel=alternate][hreflang=${other}]`)).toHaveAttribute(
      'href',
      `https://hilldale.band/${other}/`,
    );
  });
}

test.describe('French browser', () => {
  test.use({ locale: 'fr-FR' });
  test('root goes to /fr/', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/fr\/$/);
  });
});

test.describe('German browser', () => {
  test.use({ locale: 'de-DE' });
  test('root falls back to /en/', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/en\/$/);
  });
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('root shows a plain link to each language', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('a[href="/fr/"]')).toBeVisible();
    await expect(page.locator('a[href="/en/"]')).toBeVisible();
  });

  test('the language toggle is a plain link', async ({ page }) => {
    await page.goto('/fr/');
    await expect(page.locator('a[data-lang-toggle]')).toHaveAttribute('href', '/en/');
  });
});

test('the language toggle keeps the current section', async ({ page }) => {
  await page.goto('/fr/#press');
  await page.locator('a[data-lang-toggle]').click();
  await expect(page).toHaveURL(/\/en\/#press$/);
});
