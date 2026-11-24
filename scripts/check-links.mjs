// Fails when a built page links outside the folder the site is published in.
// Run after a build: BASE_PATH=/epk-hilldale node scripts/check-links.mjs
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const base = (process.env.BASE_PATH || '').replace(/\/$/, '') + '/';
const site = process.env.SITE_URL || 'https://hilldale.band';
const ROOT_RELATIVE = /(?:href|src|srcset|content|action)=["']?(\/(?!\/)[^"'\s>,]*)|url\((?:["']?)(\/(?!\/)[^)"']*)/g;
const ABSOLUTE_OWN = new RegExp(`${site.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}(/[^"'\\s>)]*)`, 'g');

const problems = [];
for (const file of readdirSync('dist', { recursive: true }).map(String)) {
  if (!/\.(html|css)$/.test(file)) continue;
  const text = readFileSync(join('dist', file), 'utf8');
  for (const match of text.matchAll(ROOT_RELATIVE)) {
    const path = match[1] ?? match[2];
    if (!path.startsWith(base)) problems.push(`${file}: ${path}`);
  }
  for (const match of text.matchAll(ABSOLUTE_OWN)) {
    if (!match[1].startsWith(base)) problems.push(`${file}: ${match[0]}`);
  }
}

if (problems.length) {
  console.error(`${problems.length} link(s) outside ${base}:\n` + [...new Set(problems)].slice(0, 40).join('\n'));
  process.exit(1);
}
console.log(`All links stay inside ${site}${base}`);
