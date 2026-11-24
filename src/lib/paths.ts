// Every internal link goes through these, so the site works both at a domain root
// (https://hilldale.band/) and in a sub-folder (https://md4.github.io/epk-hilldale/).
const BASE = import.meta.env.BASE_URL.replace(/\/?$/, '/');

/** 'fr/' -> '/fr/' at the root, '/epk-hilldale/fr/' in a sub-folder. */
export const href = (path = '') => BASE + path.replace(/^\/+/, '');

/** Full public address of a path, for canonical links, previews and QR codes. */
export const absolute = (path = '') => new URL(href(path), import.meta.env.SITE).href;

export const BASE_PATH = BASE;
