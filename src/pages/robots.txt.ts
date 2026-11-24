import type { APIRoute } from 'astro';
import { shared } from '../content/shared';
import { href } from '../lib/paths';

// While the press kit is unlisted, crawlers are asked to stay out entirely.
// Once SITE.indexable is true, only the downloads stay off limits.
export const GET: APIRoute = () =>
  new Response(`User-agent: *\nDisallow: ${shared.SITE.indexable ? href('downloads/') : '/'}\n`, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
