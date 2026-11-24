# HILLDALE press kit

The band's electronic press kit: one page in French and English, a one-sheet and a tech sheet as PDFs, and a ZIP with every photo and logo.

Live at https://md4.github.io/epk-hilldale/ (and at https://hilldale.band once the domain is attached).

## Setup

Needs Node 24 (Astro refuses older versions).

```sh
nvm use          # reads .nvmrc
npm install
npx playwright install chromium   # only for the tests and the PDFs
```

## Where the content lives

| What | File |
|---|---|
| Shows, press quotes, links, videos, line-up, EP credits, photos, "for fans of", set length, booking contact | `src/content/shared.ts` |
| All French text (bio, tagline, labels) | `src/content/fr.ts` |
| All English text | `src/content/en.ts` |
| Tech sheet (patch list, stage plot, hospitality, technical contact) | `src/content/tech.ts` |
| Original photos and logos | `resources/photos/`, `resources/logos/` |

`resources/private/` is ignored by git and never published. Keep anything with personal details there.

### Add a show

Add a line to `shows` in `src/content/shared.ts`:

```ts
{ date: '2027-03-12', city: 'Nantes', venue: 'Le Ferrailleur', with: 'Band A, Band B', confirmed: true },
```

Only shows with `confirmed: true` appear. The page sorts them into "Upcoming" and "Past" using the visitor's date, so nothing needs updating after a show has happened.

### Add a press quote

Add an entry to `press` in the same file, with the source and the date. Add `url` when the article link is known, and an English translation under `quote.en`.

## After any content change

```sh
npm run pdfs                    # regenerates the one-sheets and tech sheets in public/downloads/
npm test && npm run test:e2e    # unit tests, then the browser tests
```

Commit the regenerated PDFs together with the content change. The deploy regenerates them anyway with the live address, so the published PDFs are always current.

## Preview locally

```sh
npm run build
node scripts/serve-dist.mjs 4400   # then open http://localhost:4400/
```

## Publishing

Every push to `main` runs `.github/workflows/deploy.yml`: unit tests, PDFs, build, link check, then GitHub Pages. Follow it in the repository's Actions tab. It can also be run by hand from there ("Run workflow").

The workflow asks GitHub where the site is published and builds for that address, so nothing in the code names it.

### Attaching hilldale.band

1. Buy the domain and add these DNS records at the registrar (check them against GitHub's Pages docs):
   - `A` records on `@`: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
   - `AAAA` records on `@`: 2606:50c0:8000::153, 2606:50c0:8001::153, 2606:50c0:8002::153, 2606:50c0:8003::153
   - `CNAME` on `www`: md4.github.io
2. In GitHub: Settings > Pages > Custom domain: `hilldale.band`, then tick "Enforce HTTPS" once it is offered.
3. Re-run the Deploy workflow from the Actions tab, so the pages and PDFs carry the new address.

### Search engines

The page is hidden from search engines while `SITE.indexable` is `false` in `src/content/shared.ts`. Set it to `true` to let them list it.

### Checking a sub-folder build locally

```sh
SITE_URL=https://md4.github.io BASE_PATH=/epk-hilldale npm run build
SITE_URL=https://md4.github.io BASE_PATH=/epk-hilldale node scripts/check-links.mjs
```
