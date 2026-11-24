import { expect, test } from '@playwright/test';

const EMAIL = 'hilldaledowntempo44@gmail.com';
const TAGLINE = { fr: 'Dark hardcore de Nantes', en: 'Dark hardcore from Nantes, France' };

for (const lang of ['fr', 'en'] as const) {
  test.describe(`/${lang}/`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/${lang}/`);
    });

    test('sections come in the agreed order', async ({ page }) => {
      const ids = await page.locator('main > [id]').evaluateAll((els) => els.map((el) => el.id));
      expect(ids).toEqual(['top', 'listen', 'bio', 'press', 'lineup', 'photos', 'technical']);
      await expect(page.locator('main + footer#contact')).toHaveCount(1);
    });

    test('the header gives the tagline and the booking email', async ({ page }) => {
      const header = page.locator('#top');
      await expect(header).toContainText(TAGLINE[lang]);
      await expect(header).toContainText(EMAIL);
      await expect(header.locator(`a[href="mailto:${EMAIL}"]`).first()).toBeVisible();
    });

    test('the featured clip loads YouTube only when played', async ({ page }) => {
      const listen = page.locator('#listen');
      await expect(listen.locator('iframe[src*="youtube"]')).toHaveCount(0);
      await listen.locator('[data-yt-embed]').click();
      await expect(listen.locator('iframe[src*="youtube"]')).toHaveAttribute(
        'src',
        /youtube-nocookie\.com\/embed\/4ll4Ep1TsqI/,
      );
      // The player is not nested inside a link, and the clip title still links to YouTube.
      await expect(listen.locator('a iframe')).toHaveCount(0);
      await expect(listen.locator('a[href="https://www.youtube.com/watch?v=4ll4Ep1TsqI"]')).toBeVisible();
    });

    test('a modified click on the featured clip is left to the browser', async ({ page }) => {
      await page.locator('#listen [data-yt-embed]').click({ modifiers: ['ControlOrMeta'] });
      await expect(page.locator('#listen iframe[src*="youtube"]')).toHaveCount(0);
    });

    test('keyboard users can skip the top bar', async ({ page }) => {
      await page.keyboard.press('Tab');
      await expect(page.locator(':focus')).toHaveAttribute('href', '#main');
    });

    test('every download link has its own name', async ({ page }) => {
      const names = await page
        .locator('#photos a[download]')
        .evaluateAll((links) => links.map((a) => a.getAttribute('aria-label')));
      expect(names).toHaveLength(8);
      expect(new Set(names).size).toBe(8);
    });

    test('a shared link has a preview image', async ({ page, request }) => {
      const url = await page.locator('meta[property="og:image"]').getAttribute('content');
      expect(url).toMatch(/^https:\/\/hilldale\.band\/.+\.jpe?g$/);
      const response = await request.get(new URL(url!).pathname);
      expect(response.headers()['content-type']).toBe('image/jpeg');
    });

    test('the bios are final and the confirmed shows are listed', async ({ page }) => {
      await expect(page.locator('#bio')).not.toContainText(/DRAFT|BROUILLON/);
      await expect(page.locator('#press [data-shows] li')).toHaveCount(10);
      await expect(page.locator('#press [data-shows]')).toContainText('Coilguns');
      await expect(page.locator('#press [data-shows]')).toContainText('Poum Poum T’chak');
    });

    test('the EP can be played on the page', async ({ page }) => {
      const player = page.locator('#listen iframe[src*="bandcamp.com/EmbeddedPlayer/album=2247878127"]');
      await expect(player).toHaveCount(0);
      await page.locator('#listen button[data-bandcamp]').click();
      await expect(player).toHaveCount(1);
    });

    test('the header facts name the line-up', async ({ page }) => {
      for (const name of ['Jojo', 'Suli', 'Leo', 'Marty']) {
        await expect(page.locator('#top [data-facts]')).toContainText(name);
      }
    });

    test('no image falls back to a heavy file', async ({ page, request }) => {
      const sources = await page.locator('img').evaluateAll((imgs) => [...new Set(imgs.map((i) => i.getAttribute('src')!))]);
      expect(sources.length).toBeGreaterThan(8);
      for (const src of sources) {
        expect((await (await request.get(src)).body()).length, src).toBeLessThan(500_000);
      }
    });

    test('press quotes carry their source', async ({ page }) => {
      const quotes = page.locator('#press [data-quote]');
      await expect(quotes).toHaveCount(2);
      await expect(quotes.nth(0)).toContainText('bastonne.fr');
      await expect(quotes.nth(0)).toContainText('25.02.2026');
      await expect(quotes.nth(1)).toContainText('Du son, des mots');
    });

    test('the line-up lists the four members by first name', async ({ page }) => {
      await expect(page.locator('#lineup [data-member]')).toHaveText([/^Jojo$/, /^Suli$/, /^Leo$/, /^Marty$/]);
    });

    test('photos are previews with alt text, never the originals', async ({ page }) => {
      const previews = page.locator('#photos [data-photo] img');
      await expect(previews).toHaveCount(4);
      for (const alt of await previews.evaluateAll((imgs) => imgs.map((i) => i.getAttribute('alt')))) {
        expect(alt?.trim()).toBeTruthy();
      }
      await expect(page.locator('img[src*="/downloads/"]')).toHaveCount(0);
    });

    test('optional content shows when known and leaves nothing behind when not', async ({ page }) => {
      await expect(page.locator('[data-field="photo-credit"]')).toHaveCount(0);
      await expect(page.locator('#top [data-field="fans-of"]')).toContainText('Hexis');
      await expect(page.locator('#technical [data-field="set-length"]')).toContainText('33');
      await expect(page.locator('#listen [data-field="credits"]')).toContainText('Christophe Hogomat');
      await expect(page.locator('#listen [data-field="credits"]')).toContainText('Thibault Chaumont');
    });

    test('nothing scrolls sideways on a 320 px phone', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 640 });
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  });

  test(`/${lang}/ first load stays under 1.5 MB`, async ({ page }) => {
    let bytes = 0;
    page.on('response', async (response) => {
      bytes += (await response.body().catch(() => Buffer.alloc(0))).length;
    });
    await page.goto(`/${lang}/`, { waitUntil: 'networkidle' });
    expect(bytes).toBeGreaterThan(0);
    expect(bytes).toBeLessThan(1_500_000);
  });
}

test.describe('on 9 December 2026', () => {
  test('shows are labelled upcoming and past from the visitor\'s date', async ({ page }) => {
    await page.clock.setFixedTime(new Date('2026-12-09T12:00:00'));
    await page.goto('/en/');
    const upcoming = page.locator('#press [data-shows-group="upcoming"]');
    const past = page.locator('#press [data-shows-group="past"]');
    await expect(upcoming.locator('h4')).toHaveText('Upcoming');
    await expect(upcoming.locator('li .date')).toHaveText(['09.12.2026', '10.12.2026', '30.01.2027']);
    await expect(past.locator('h4')).toHaveText('Past');
    await expect(past.locator('li')).toHaveCount(7);
    await expect(past.locator('li .date').first()).toHaveText('13.11.2026');
  });
});

test('once every show is behind us, the upcoming label disappears', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2027-02-01T12:00:00'));
  await page.goto('/fr/');
  await expect(page.locator('#press [data-shows-group="upcoming"]')).toBeHidden();
  await expect(page.locator('#press [data-shows-group="past"] li')).toHaveCount(10);
  await expect(page.locator('#press [data-shows-group="past"] h4')).toHaveText('Passés');
});

test('on a wide screen the page stays a moderate width', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/en/');
  const hero = await page.locator('#top .hero').boundingBox();
  expect(hero!.width).toBeLessThanOrEqual(1120);
  expect(hero!.height).toBeLessThanOrEqual(670);
  // The booking email fits on one line.
  const email = await page.locator('#top .email').boundingBox();
  expect(email!.height).toBeLessThan(30);
  // Centred, with the same margin on both sides.
  expect(Math.abs(hero!.x - (1920 - hero!.x - hero!.width))).toBeLessThanOrEqual(1);
});

test('the bio ends on the album sentence the band chose', async ({ page }) => {
  await page.goto('/en/');
  await expect(page.locator('[data-bio="short"]')).toContainText('writing its first full-length, the follow-up to the EP');
});

test('the English header gives the top quote in English, marked as a translation', async ({ page }) => {
  await page.goto('/en/');
  await expect(page.locator('#top [data-facts]')).toContainText('Dark, visceral hardcore');
  await expect(page.locator('#top [data-facts]')).toContainText('translated from French');
});

test('search engines are told to stay out while the page is unlisted', async ({ request }) => {
  expect(await (await request.get('/robots.txt')).text()).toMatch(/^Disallow: \/$/m);
});

test('a wrong address offers both languages', async ({ page }) => {
  await page.goto('/404.html');
  await expect(page.locator('a[href="/fr/"]')).toBeVisible();
  await expect(page.locator('a[href="/en/"]')).toBeVisible();
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('each clip is a plain link to YouTube', async ({ page }) => {
    await page.goto('/en/');
    for (const id of ['4ll4Ep1TsqI', 'xripHM9u9F4', 'nK1wYC-rL4E']) {
      await expect(
        page.locator(`#listen a[href="https://www.youtube.com/watch?v=${id}"]`),
      ).toBeVisible();
    }
  });
});
