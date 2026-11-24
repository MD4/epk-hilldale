import type { APIRoute } from 'astro';
import { LANGS, getContent, type Lang } from '../../../lib/content';

// Plain-text bios, short then long, for people who want to paste them somewhere.
export function getStaticPaths() {
  return LANGS.map((lang) => ({ params: { lang } }));
}

export const GET: APIRoute = ({ params }) => {
  const { t } = getContent(params.lang as Lang);
  return new Response(`HILLDALE\n${t.tagline}\n\n${t.bioShort}\n\n${t.bioLong}\n`, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
};
