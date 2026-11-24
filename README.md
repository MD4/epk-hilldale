# HILLDALE · Press kit

Electronic press kit for HILLDALE, dark hardcore from Nantes, France.

**Live:** https://md4.github.io/epk-hilldale/ (moving to https://hilldale.band)

One page in French and English, plus:

- a one-sheet PDF in each language
- a tech rider (French and English) with the stage plot
- a ZIP with every photo, logo, PDF and the bio as text

Everything is generated from a few content files, so the page, the PDFs and the ZIP never disagree.

---

## Updating the content

Almost everything lives in `src/content/`:

| To change… | Edit |
|---|---|
| Shows, press quotes, links, videos, line-up, EP credits, photos, "for fans of", set length, booking contact | `src/content/shared.ts` |
| French text: bio, tagline, labels | `src/content/fr.ts` |
| English text | `src/content/en.ts` |
| Tech rider: input list, stage plot, hospitality, technical contact | `src/content/tech.ts` |

### Add a show

Add a line to `shows` in `src/content/shared.ts`:

```ts
{ date: '2027-03-12', city: 'Nantes', venue: 'Le Ferrailleur', with: 'Band A, Band B', confirmed: true },
```

Only shows with `confirmed: true` appear. The page sorts them into **Upcoming** and **Past** using the visitor's date, so nothing needs changing after a show has happened.

### Add a press quote

Add an entry to `press` in the same file. Always give the source and the date. Add `url` when the article link is known, and an English translation under `quote.en`.

### Add or replace a photo

1. Put the full-resolution JPEG in `resources/photos/`.
2. Add it to `photos` in `src/content/shared.ts`, with a short description in both languages.

The page shows resized copies; the original is what people download.

### Keep private things private

`resources/private/` is never committed or published. Original documents with phone numbers or other personal details go there.

---

## Publishing

Push to `main`. A GitHub Action then runs the tests, rebuilds the site and the PDFs, checks every link and publishes the result. It takes about three minutes; follow it in the repository's **Actions** tab, where it can also be re-run by hand.

### Moving to hilldale.band

The DNS records are already set at OVH. Once the domain resolves:

1. In the repository: **Settings › Pages › Custom domain** → `hilldale.band`.
2. Tick **Enforce HTTPS** once GitHub offers it.
3. Re-run the latest **Deploy** workflow, so the pages and PDFs carry the new address.

The old `md4.github.io/epk-hilldale` link then redirects to the new domain. No code change is needed: the workflow asks GitHub where the site is published.

### Search engines and link previews

Search engines may list the page; the `downloads/` folder stays out of their reach. Set `SITE.indexable` to `false` in `src/content/shared.ts` to hide the page again.

Link previews use `src/pages/og-image.jpg.ts`, a 1200 × 630 picture built from the stairs photo.

---

## Working on it locally

You need Node 24 (`nvm use` reads `.nvmrc`).

```sh
npm install
npx playwright install chromium   # once; used by the tests and the PDFs

npm run build                     # build the site into dist/
npm run preview                   # then open http://localhost:4400/
npm run pdfs                      # regenerate the PDFs in public/downloads/
npm test                          # content and component tests
npm run test:e2e                  # browser tests (builds the site first)
```

Run `npm run pdfs` and both test commands before pushing a content change, and commit the regenerated PDFs with it.

### Project layout

```
src/content/     everything the band edits (see above)
src/components/  one file per page section
src/pages/       the page, the print pages for the PDFs, share image, sitemap, manifest
resources/       original photos and logos (resources/private/ is ignored)
public/          icons and the generated PDFs
scripts/         PDF printing, ZIP and download packaging, link check, icon generation
tests/           unit tests and browser tests (tests/e2e/)
```

After changing `public/favicon.svg`, run `node scripts/make-favicons.mjs` to regenerate the other icons.
