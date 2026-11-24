import type { APIRoute } from 'astro';
import { LANGS } from '../lib/content';
import { absolute } from '../lib/paths';

// Both language versions, each pointing to the other, with English as the default.
export const GET: APIRoute = () => {
  const alternates = [
    ...LANGS.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${absolute(`${l}/`)}"/>`),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${absolute('en/')}"/>`,
  ].join('\n');
  const urls = LANGS.map((l) => `  <url>\n    <loc>${absolute(`${l}/`)}</loc>\n${alternates}\n  </url>`).join('\n');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`,
    { headers: { 'content-type': 'application/xml; charset=utf-8' } },
  );
};
