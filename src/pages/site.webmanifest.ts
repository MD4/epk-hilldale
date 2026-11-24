import type { APIRoute } from 'astro';
import { href } from '../lib/paths';

// Used when someone adds the press kit to their phone's home screen.
export const GET: APIRoute = () =>
  new Response(
    JSON.stringify(
      {
        name: 'HILLDALE · Press kit',
        short_name: 'HILLDALE',
        description: 'Dark hardcore from Nantes, France.',
        start_url: href(''),
        scope: href(''),
        display: 'browser',
        background_color: '#f2f2ef',
        theme_color: '#000000',
        icons: [
          { src: href('icon-192.png'), sizes: '192x192', type: 'image/png' },
          { src: href('icon-512.png'), sizes: '512x512', type: 'image/png' },
          { src: href('icon-maskable-512.png'), sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      null,
      2,
    ),
    { headers: { 'content-type': 'application/manifest+json' } },
  );
