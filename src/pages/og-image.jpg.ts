import type { APIRoute } from 'astro';
import sharp from 'sharp';

// The 1200 × 630 picture shown when the link is shared: the stairs photo with the
// wordmark across it, inverted the same way as the page header.
export const GET: APIRoute = async () => {
  const W = 1200;
  const H = 630;
  const file = 'resources/photos/hilldale-promo-12.jpg';
  const original = await sharp(file).metadata();
  const height = Math.round((W * original.height!) / original.width!);
  // Same framing as the page header: heads just under the wordmark.
  const base = await sharp(file)
    .resize({ width: W })
    .extract({ left: 0, top: Math.round((height - H) * 0.66), width: W, height: H })
    .toBuffer();
  const wordmark = await sharp('resources/logos/hilldale-wordmark-white.png').resize({ width: W - 80 }).toBuffer();
  const cross = await sharp('resources/logos/hilldale-symbol-black.png').resize({ height: 92 }).toBuffer();

  const image = await sharp(base)
    .composite([
      { input: wordmark, left: 40, top: 34, blend: 'difference' },
      { input: cross, left: 44, top: H - 92 - 34 },
    ])
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();

  return new Response(new Uint8Array(image), { headers: { 'content-type': 'image/jpeg' } });
};
