import type { APIRoute } from 'astro';
import { shared } from '../content/shared';
import { absolute, href } from '../lib/paths';

// While the press kit is unlisted, crawlers are asked to stay out entirely.
// Once SITE.indexable is true, only the downloads stay off limits.
export const GET: APIRoute = () =>
  new Response(
    shared.SITE.indexable
      ? `User-agent: *\nDisallow: ${href('downloads/')}\n\nSitemap: ${absolute('sitemap.xml')}\n`
      : 'User-agent: *\nDisallow: /\n',
    {
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    },
  );
