import { en } from '../content/en';
import { fr } from '../content/fr';
import { shared } from '../content/shared';
import type { Content, Lang } from '../content/types';

export type { Content, Lang };

export const LANGS: Lang[] = ['fr', 'en'];

const strings = { fr, en };

export function otherLang(lang: Lang): Lang {
  return lang === 'fr' ? 'en' : 'fr';
}

export function getContent(lang: Lang): Content {
  return { lang, shared, t: strings[lang] };
}
