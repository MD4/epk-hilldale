# HILLDALE press kit

The band's electronic press kit: one page in French and English, a one-sheet and a tech sheet as PDFs, and a ZIP with every photo and logo. Published at https://hilldale.band.

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

Commit the regenerated PDFs together with the content change. The one-sheet's "Upcoming / Past" labels are fixed on the day the PDFs are generated.

## Preview locally

```sh
npm run build
node scripts/serve-dist.mjs 4400   # then open http://localhost:4400/
```

## Publishing

Every push to `main` builds the site and publishes it on GitHub Pages (`.github/workflows/deploy.yml`). The workflow only runs while the repository is public.

The page is hidden from search engines while `SITE.indexable` is `false` in `src/content/shared.ts`. Set it to `true` to let them list it.
