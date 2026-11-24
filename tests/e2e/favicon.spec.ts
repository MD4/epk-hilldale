import { expect, test } from '@playwright/test';

for (const path of ['/fr/', '/en/', '/', '/404.html', '/en/onesheet/']) {
  test(`${path} names the band's icons`, async ({ page, request }) => {
    await page.goto(path);
    const svg = await page.locator('link[rel="icon"][type="image/svg+xml"]').getAttribute('href');
    const ico = await page.locator('link[rel="icon"][sizes="32x32"]').getAttribute('href');
    const touch = await page.locator('link[rel="apple-touch-icon"]').getAttribute('href');

    const svgResponse = await request.get(svg!);
    expect(svgResponse.headers()['content-type']).toBe('image/svg+xml');
    expect(await svgResponse.text()).toContain('<title>HILLDALE</title>');
    expect((await request.get(ico!)).headers()['content-type']).toBe('image/x-icon');
    expect((await request.get(touch!)).headers()['content-type']).toBe('image/png');
  });
}
