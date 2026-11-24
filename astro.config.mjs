// @ts-check
import { defineConfig } from 'astro/config';

// Where the site is published. The deploy workflow sets both from GitHub Pages:
// https://md4.github.io + /epk-hilldale on the free address, https://hilldale.band + / once the domain is attached.
export default defineConfig({
  site: process.env.SITE_URL || 'https://hilldale.band',
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'always',
});
