import { expect, test } from '@playwright/test';

const shortBio = (page: import('@playwright/test').Page) =>
  page.locator('[data-bio="short"]').evaluate((el) => el.textContent!.trim());

test('copy puts the short bio on the clipboard and confirms it', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/en/');
  const button = page.locator('[data-copy="short"]');
  await button.click();
  await expect(button).toHaveText('Copied');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(await shortBio(page));
  await expect(button).toHaveText('Copy text', { timeout: 5000 });
});

test('when the clipboard is refused, copy selects the text instead', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: () => Promise.reject(new Error('refused')) },
    });
  });
  await page.goto('/en/');
  await page.locator('[data-copy="short"]').click();
  await expect
    .poll(() => page.evaluate(() => window.getSelection()!.toString().trim()))
    .toBe(await shortBio(page));
});

test('read more reveals the long bio', async ({ page }) => {
  await page.goto('/fr/');
  const long = page.locator('[data-bio="long"]');
  await expect(long).toBeHidden();
  await page.locator('#bio summary').click();
  await expect(long).toBeVisible();
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('the long bio still opens and copy buttons are not offered', async ({ page }) => {
    await page.goto('/fr/');
    await page.locator('#bio summary').click();
    await expect(page.locator('[data-bio="long"]')).toBeVisible();
    await expect(page.locator('[data-copy]').first()).toBeHidden();
  });
});
