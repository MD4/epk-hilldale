# HILLDALE EPK Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build HILLDALE's bilingual one-page press kit as a static site, with generated one-sheet and tech sheet PDFs and a press kit ZIP, ready to publish on GitHub Pages at `hilldale.band`.

**Architecture:** An Astro static site at the repo root. All facts live in typed content modules (`src/content/`), read through one function, and rendered by one page per language plus two print-only routes per language. A local script prints those routes to PDF with Playwright and commits them; a post-build script copies originals into `dist/downloads/` and assembles the ZIP, so the deploy workflow needs no browser.

**Tech Stack:** Astro (latest stable, static output, no UI framework), TypeScript, Vitest (content tests), `@playwright/test` (site tests and PDF printing), `archiver` (ZIP), `pdf-lib` (PDF page count in tests), `qrcode` (one-sheet QR), GitHub Pages + GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-11-24-hilldale-epk-design.md`

## Global Constraints

- Languages: `fr` and `en`, at `/fr/` and `/en/`. `/` redirects by browser language, falling back to `en`.
- Look: take C, "Flyer", as recorded in the spec's "Look" section. Paper `#f2f2ef`, ink `#000`, no colour anywhere, no gradients. Display face Big Shoulders Display (600, 800), body face Archivo.
- Booking contact: `Jojo`, `hilldaledowntempo44@gmail.com`. No phone number on any page or generated file.
- Tech sheet contact: Suli's email only (value is in `resources/private/`, read it there). No mobile number.
- Line-up, first names only: Jojo (vocals), Suli (guitar), Leo (bass), Marty (drums).
- Every page carries `<meta name="robots" content="noindex">` while `SITE.indexable` is `false`.
- First load of `/fr/` or `/en/` transfers under 1.5 MB before any video is played.
- Original promo photos (7 to 15 MB each) are never referenced by `<img>`; only as download links.
- Nothing under `resources/private/` is ever committed or copied into `dist/`.
- No GitHub Actions job may run while the repo is private.
- Every press quote carries a source name and a date. No unattributed quote is rendered.
- Sections and labels whose content is empty are not rendered at all.
- Commit after each task. Do not push to a public remote; launch (Task 8) needs the owner's explicit go-ahead.

## Review Focus

1. JavaScript off or YouTube blocked: each clip is still a plain link to its YouTube URL, and the language toggle is still a plain link. (Test in Task 3.)
2. Browser language is neither French nor English (for example `de`), or JavaScript is off at `/`: the visitor lands on `/en/`, or sees two plain links. (Test in Task 2.)
3. A 320 px wide phone: the long booking email and long French words do not cause horizontal scrolling. (Test in Task 3.)
4. Clipboard access refused by the browser: "copy text" selects the bio text instead of failing silently. (Test in Task 4.)
5. Optional content missing (no "for fans of", no set length, no photographer credit, no live photos): no empty heading, label or separator is left behind, on the page or in the PDFs. (Tests in Tasks 3 and 6.)

---

## File Structure

```
astro.config.mjs            site URL, static output
package.json                scripts: dev, build, test, test:e2e, pdfs
src/content/types.ts        Content, Shared, Strings, TechSheet types
src/content/shared.ts       facts: links, videos, shows, members, press, downloads, SITE flags
src/content/fr.ts, en.ts    all visible text per language
src/content/tech.ts         patch list, stage plot positions, hospitality, in both languages
src/lib/content.ts          getContent(lang), LANGS, otherLang(lang)
src/layouts/Base.astro      <head>, fonts, global CSS tokens, noindex
src/layouts/Print.astro     A4 print layout shared by one-sheet and tech sheet
src/pages/index.astro       language redirect
src/pages/[lang]/index.astro        the EPK page
src/pages/[lang]/onesheet.astro     print route
src/pages/[lang]/tech.astro         print route
src/components/             Header, Media, LiteYouTube, Bio, CopyButton, Press, Lineup,
                            Gallery, Technical, Contact, StagePlot (one file each)
resources/photos/, resources/logos/   originals, single copy, renamed
resources/private/          ignored
public/downloads/           committed generated PDFs
public/CNAME                hilldale.band
scripts/build-pdfs.mjs      prints the four print routes to public/downloads/
scripts/postbuild.mjs       copies originals to dist/downloads/, writes the ZIP
tests/content.test.ts       Vitest
tests/e2e/*.spec.ts         Playwright against `astro preview`
.github/workflows/deploy.yml
README.md                   how to update content, regenerate PDFs, publish
```

---

### Task 1: Project scaffold and content model

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/content/types.ts`, `src/content/shared.ts`, `src/content/fr.ts`, `src/content/en.ts`, `src/lib/content.ts`, `tests/content.test.ts`
- Move: `resources/Hilldale-promo-NN-edit.jpg` → `resources/photos/hilldale-promo-NN.jpg` (01, 09, 10, 12); `Logo Hilldale Blanc.png` → `resources/logos/hilldale-symbol-white.png`, `Logo Hilldale Noir.png` → `hilldale-symbol-black.png`, `Typo Hilldale Blanche.png` → `hilldale-wordmark-white.png`, `Typo Hilldale Noire.png` → `hilldale-wordmark-black.png` (use `git mv`)
- Modify: `.gitignore` (add `node_modules/`, `dist/`, `.astro/`, `test-results/`, `playwright-report/`)

**Interfaces:**
- Produces: `type Lang = 'fr' | 'en'`; `LANGS: Lang[]`; `otherLang(lang: Lang): Lang`; `getContent(lang: Lang): Content` where `Content = { lang: Lang; shared: Shared; t: Strings }`.
- `Shared`: `SITE: { url: 'https://hilldale.band'; indexable: false }`, `booking: { name: string; email: string }`, `links: { instagram; facebook; bandcamp; spotify; deezer; youtube }`, `videos: { id: string; title: string; featured?: true }[]`, `ep: { title: 'Hilldale'; released: '2025-10-31'; bandcampUrl: string; bandcampAlbumId?: string; credits?: {...} }`, `members: { name: string; role: 'vocals'|'guitar'|'bass'|'drums' }[]`, `press: { source: string; date: string; url?: string; quote: { fr: string; en?: string } }[]`, `shows: { date: string; city: string; venue?: string; with?: string; confirmed: boolean }[]`, `photos: { file: string; credit?: string; alt: { fr: string; en: string } }[]`, `forFansOf: string[]`, `setLengthMinutes?: number`.
- `Strings`: `tagline`, `bioShort`, `bioLong`, plus one label per heading and button. Both language files satisfy the same type.
- Seed values: videos `4ll4Ep1TsqI` (Regarde, featured), `xripHM9u9F4` (Agonie), `nK1wYC-rL4E` (Addictions); Spotify artist `2EyrghTIegnNTZAvIIMzvA`; Deezer artist `346979681`; Bandcamp `https://hilldale44.bandcamp.com/album/hilldale`; Instagram `hilldale_band`; Facebook `Hilldale.band`; press and shows from the spec's "Content already collected" section; `forFansOf: []`; `tagline` "Dark hardcore from Nantes, France" / "Dark hardcore de Nantes".
- Shows are rendered only when `confirmed` is `true`. Seed the October and November 2026 dates with `confirmed: false`.

- [ ] **Step 1: Scaffold.** `npm create astro@latest . -- --template minimal --typescript strict --no-git --install`, then `npm i -D vitest @playwright/test archiver pdf-lib qrcode` and `npx playwright install chromium`. Set `site: 'https://hilldale.band'` in `astro.config.mjs`. Add scripts `test` (`vitest run`), `test:e2e` (`playwright test`), `pdfs`, and `build` (`astro build && node scripts/postbuild.mjs`).
- [ ] **Step 2: Move and rename the resources** as listed, with `git mv`.
- [ ] **Step 3: Write the failing tests** in `tests/content.test.ts`:

```ts
test('both languages define the same string keys', () => {
  expect(Object.keys(getContent('fr').t).sort()).toEqual(Object.keys(getContent('en').t).sort())
})
test('no string is empty', () => {
  for (const l of LANGS) for (const v of Object.values(getContent(l).t)) expect(v.trim()).not.toBe('')
})
test('bio lengths', () => {
  for (const l of LANGS) {
    const { bioShort, bioLong } = getContent(l).t
    expect(bioShort.split(/\s+/).length).toBeLessThanOrEqual(60)
    expect(bioLong.split(/\s+/).length).toBeLessThanOrEqual(170)
  }
})
test('every press quote has a source and an ISO date', () => {
  for (const p of getContent('fr').shared.press) {
    expect(p.source).not.toBe(''); expect(p.date).toMatch(/^\d{4}-\d{2}(-\d{2})?$/)
  }
})
test('no phone number anywhere in content', () => {
  const dump = JSON.stringify(LANGS.map(getContent))
  expect(dump).not.toMatch(/(\+33|0)[1-9]([ .]?\d{2}){4}/)
})
test('exactly one featured video', () => {
  expect(getContent('fr').shared.videos.filter(v => v.featured)).toHaveLength(1)
})
test('otherLang', () => { expect(otherLang('fr')).toBe('en'); expect(otherLang('en')).toBe('fr') })
```

- [ ] **Step 4: Run** `npm test`. Expected: FAIL, modules not found.
- [ ] **Step 5: Implement** the types, `shared.ts`, `fr.ts`, `en.ts`, `content.ts`. Use placeholder bios marked `DRAFT` that already respect the word limits; Task 7 replaces them.
- [ ] **Step 6: Run** `npm test`. Expected: PASS, 7 tests.
- [ ] **Step 7: Commit** `chore: scaffold Astro project and content model`.

### Task 2: Base layout, look and language routing

Follow the spec's "Look" section.

**Files:**
- Create: `src/layouts/Base.astro`, `src/pages/index.astro`, `src/pages/[lang]/index.astro`, `playwright.config.ts`, `tests/e2e/routing.spec.ts`

**Interfaces:**
- Consumes: `getContent`, `LANGS`, `otherLang`.
- Produces: `Base.astro` props `{ lang: Lang; title: string; description: string }`, a default slot, CSS custom properties `--paper: #f2f2ef`, `--ink: #000`, `--muted`, `--rule-thick: 6px`, `--rule: 2px`, `--font-display`, `--font-body`, and a `.wrap` container class. Section anchors used by every later task: `#listen`, `#bio`, `#press`, `#lineup`, `#photos`, `#technical`, `#contact`.
- Playwright config: `webServer` runs `npm run build && npx astro preview --port 4321`, `baseURL` `http://localhost:4321`, projects `desktop` (1280×800) and `phone` (390×844).

- [ ] **Step 1: Write the failing tests** in `tests/e2e/routing.spec.ts`:
  - `/fr/` has `html[lang=fr]`, `/en/` has `html[lang=en]`, each has exactly one `h1`.
  - Both have `meta[name=robots][content=noindex]`.
  - Both have `link[rel=alternate][hreflang]` for the other language.
  - With `locale: 'fr-FR'`, visiting `/` ends on `/fr/`. With `locale: 'de-DE'`, it ends on `/en/`.
  - With `javaScriptEnabled: false`, `/` shows two links whose hrefs are `/fr/` and `/en/`.
  - On `/fr/#press`, clicking the language toggle ends on `/en/#press`.
  - With `javaScriptEnabled: false`, the toggle on `/fr/` is an `<a href="/en/">`.
- [ ] **Step 2: Run** `npm run test:e2e -- routing`. Expected: FAIL.
- [ ] **Step 3: Implement.** `Base.astro` sets the tokens, loads Big Shoulders Display and Archivo with real fallback stacks, self-hosted via `@fontsource` so there is no third-party request, and emits `noindex` when `SITE.indexable` is `false`. `[lang]/index.astro` uses `getStaticPaths` over `LANGS`. `index.astro` redirects with an inline script on `navigator.language` and contains the two plain links as fallback. The toggle is an anchor; a small inline script appends `location.hash` on click.
- [ ] **Step 4: Run** `npm run test:e2e -- routing`. Expected: PASS in both projects.
- [ ] **Step 5: Commit** `feat: base layout, monochrome tokens and language routing`.

### Task 2b: Look pass (needs the owner; done first, before Task 1)

No code in the repo. Output is a decision that Tasks 2, 3 and 6 follow.

- [x] **Step 1:** On a Claude Design canvas, mock three takes on the top of the page (header plus "listen and watch"), each at phone (390 px) and desktop (1280 px) width, using the real photos, cross symbol and wordmark. Monochrome only. The takes differ in photo use (full-bleed behind the title, or framed beside it), in how large the wordmark and cross run, and in density (stark, or dense like a gig poster).
- [x] **Step 2:** The owner picks one or mixes parts. Picked: take C, "Flyer".
- [x] **Step 3:** Record the picked direction in the spec's "Look" section: typefaces, wordmark and cross treatment, photo treatment, spacing character. Replace the three "(call)" bullets there. Tasks 2, 3 and 6 follow it.

### Task 3: Page sections

**Files:**
- Create: `src/components/Header.astro`, `Media.astro`, `LiteYouTube.astro`, `Bio.astro`, `Press.astro`, `Lineup.astro`, `Gallery.astro`, `Technical.astro`, `Contact.astro`; `tests/e2e/sections.spec.ts`
- Modify: `src/pages/[lang]/index.astro`

**Interfaces:**
- Consumes: `Content`, the anchors and tokens from Task 2.
- Produces: every component takes `{ c: Content }`. Download hrefs are fixed and reused by Tasks 5 and 6: `/downloads/photos/<file>`, `/downloads/logos/<file>`, `/downloads/hilldale-onesheet-{fr,en}.pdf`, `/downloads/hilldale-fiche-technique.pdf`, `/downloads/hilldale-tech-rider.pdf`, `/downloads/hilldale-presskit.zip`. Bio text nodes carry `data-bio="short"` and `data-bio="long"`; copy buttons carry `data-copy="short|long"` (behaviour arrives in Task 4).

- [ ] **Step 1: Write the failing tests** in `tests/e2e/sections.spec.ts`, run for both languages:
  - Sections appear in this order: header, `#listen`, `#bio`, `#press`, `#lineup`, `#photos`, `#technical`, `#contact`.
  - The header shows the tagline and the text `hilldaledowntempo44@gmail.com`, and has an `a[href="mailto:hilldaledowntempo44@gmail.com"]`.
  - `#listen` has no `iframe[src*="youtube"]` before interaction; clicking the featured clip adds one whose `src` contains `youtube-nocookie.com/embed/4ll4Ep1TsqI`.
  - With `javaScriptEnabled: false`, `#listen` contains three links to `https://www.youtube.com/watch?v=<id>`.
  - `#press` shows `bastonne.fr` and `Du son, des mots`, each next to its quote.
  - `#lineup` lists exactly `Jojo`, `Suli`, `Leo`, `Marty`.
  - `#photos` has four previews; every `img` has non-empty `alt`; no `img[src*="/downloads/"]`.
  - With the seed content: no element with `data-field="fans-of"`, `data-field="set-length"` or `data-field="photo-credit"` exists, and `#press` contains no show list (all seeded shows are unconfirmed or absent).
  - At 320 px width, `document.documentElement.scrollWidth <= window.innerWidth`.
  - Page weight: sum of `response.body().length` for all responses during `goto` plus `networkidle` is under 1 500 000 bytes.
- [ ] **Step 2: Run** `npm run test:e2e -- sections`. Expected: FAIL.
- [ ] **Step 3: Implement** the components. Photos are imported from `resources/photos/` and rendered with Astro's `<Image>` (AVIF/WebP, widths 480/960/1600, lazy below the fold); the hero uses `hilldale-promo-12.jpg` (stairs, white sky) full width with the white wordmark over it in `mix-blend-mode: difference`. Bandcamp player is an iframe only when `ep.bandcampAlbumId` is set (look it up on the album page); otherwise a link. Each optional field renders its wrapper only when the value is present.
- [ ] **Step 4: Run** `npm run test:e2e -- sections`. Expected: PASS in both projects.
- [ ] **Step 5: Look at it.** Screenshot `/fr/` at both viewports and check it against the spec's "Look" section and the two "C · Flyer" mockups. Fix what drifts from them.
- [ ] **Step 6: Commit** `feat: EPK page sections`.

### Task 4: Copy buttons

**Files:**
- Create: `src/components/CopyButton.astro`, `tests/e2e/copy.spec.ts`
- Modify: `src/components/Bio.astro`

**Interfaces:**
- Consumes: `data-bio` and `data-copy` attributes from Task 3; `Strings.copy`, `Strings.copied`.

- [ ] **Step 1: Write the failing tests:**
  - With clipboard permission granted, clicking `[data-copy=short]` puts exactly the short bio text in the clipboard and the button label changes to the `copied` string, then back.
  - With `navigator.clipboard.writeText` stubbed to reject, clicking the button leaves `window.getSelection().toString()` equal to the short bio text.
  - "Read more" reveals the long bio; with JavaScript off, the long bio is visible.
- [ ] **Step 2: Run** `npm run test:e2e -- copy`. Expected: FAIL.
- [ ] **Step 3: Implement** `CopyButton.astro` with one inline script. Use `<details>` for "read more" so it works without JavaScript.
- [ ] **Step 4: Run.** Expected: PASS.
- [ ] **Step 5: Commit** `feat: copy-text buttons for the bios`.

### Task 5: Downloads and press kit ZIP

**Files:**
- Create: `scripts/postbuild.mjs`, `tests/e2e/downloads.spec.ts`

**Interfaces:**
- Consumes: download hrefs from Task 3; `dist/` from `astro build`; PDFs in `public/downloads/` (present after Task 6; until then the ZIP simply omits them and the test for them is added in Task 6).
- Produces: `dist/downloads/photos/*`, `dist/downloads/logos/*`, `dist/downloads/hilldale-presskit.zip` containing `photos/`, `logos/`, `bio/hilldale-bio-fr.txt`, `bio/hilldale-bio-en.txt` (short then long bio, plain text, UTF-8), and later `hilldale-onesheet-*.pdf`, `hilldale-fiche-technique.pdf`, `hilldale-tech-rider.pdf`.

- [ ] **Step 1: Write the failing tests:**
  - Every `a[href^="/downloads/"]` on `/fr/` returns 200.
  - Photo downloads return `image/jpeg` and more than 5 000 000 bytes (they are the originals).
  - The ZIP lists exactly the four photos, four logos and two bio text files (compare sorted entry names).
  - No ZIP entry and no file under `dist/` has a path containing `private`.
  - `bio/hilldale-bio-fr.txt` contains the French short bio string.
- [ ] **Step 2: Run** `npm run test:e2e -- downloads`. Expected: FAIL.
- [ ] **Step 3: Implement** `scripts/postbuild.mjs`: copy `resources/photos` and `resources/logos` to `dist/downloads/`, write the bio text files from `getContent`, add any PDFs found in `public/downloads/`, write the ZIP with `archiver`. It reads only the two named resource folders.
- [ ] **Step 4: Run.** Expected: PASS.
- [ ] **Step 5: Commit** `feat: original downloads and press kit ZIP`.

### Task 6: One-sheet and tech sheet PDFs

**Files:**
- Create: `src/content/tech.ts`, `src/layouts/Print.astro`, `src/components/StagePlot.astro`, `src/pages/[lang]/onesheet.astro`, `src/pages/[lang]/tech.astro`, `scripts/build-pdfs.mjs`, `tests/e2e/print.spec.ts`
- Modify: `tests/e2e/downloads.spec.ts` (ZIP now also lists the four PDFs), `tests/content.test.ts`

**Interfaces:**
- Consumes: `Content`; the PDF filenames fixed in Task 3.
- Produces: `getTech(lang: Lang): TechSheet` with `updated: string` (ISO date), `members: string[]`, `patch: { ch: number; source: string; mic: string }[]`, `providedByVenue: string[]`, `lights: string`, `hospitality: { stage: string; backstage: string }`, `party: string[]`, `contact: { name: string; role: string; email: string }`, `plot: { label: string; x: number; y: number; kind: 'amp'|'drums'|'mic'|'monitor'|'power'|'person' }[]`.
- Transcribe every value from `resources/private/HILLDALE - Fiche technique v5.xlsx`: 13 channels (1 Kick, Shure Beta 52; 2 to 4 line inputs for kick trigger, samples and backing track of the second guitar panned stage left/"cour"; 5 to 11 drums and bass on house mics; 12 guitar, SM57 / e609 or MD421; 13 vocals, SM58), venue-provided backline (full drum kit, one guitar cabinet, one bass cabinet), own lights (6 Cameo Thunder Wash, one Stairville AF-250 fog machine, self-run and pre-programmed), touring party of 5 (4 musicians and 1 merch), hospitality as written. Add nothing the sheet does not say. English is a faithful translation.
- Stage positions from the sheet: guitar amp upstage right ("jardin" side), drums upstage centre (right-handed, 3 line outs), bass amp upstage left; Suli (guitar), Jojo (vocals, centre), Leo (bass) downstage, each with a monitor and a power drop.

- [ ] **Step 1: Write the failing tests:**
  - `content.test.ts`: `getTech('fr').patch` has 13 channels numbered 1 to 13; `fr` and `en` have the same channel count and the same `plot` length; `JSON.stringify(getTech(l))` contains no phone number (same regex as Task 1) and contains the technical contact email.
  - `print.spec.ts`: `/fr/onesheet/` shows the tagline, the French short bio, the top press quote with its source, the booking email, and an `svg` or `img` QR code; it shows no `data-field="fans-of"` and no empty show list with seed content.
  - `/en/tech/` shows 13 table rows, the stage plot `svg` with labels `Suli`, `Jojo`, `Leo`, `Marty`, and the `updated` date; no `data-field="set-length"` when unset.
  - After `npm run pdfs`: the four files exist in `public/downloads/`; with `pdf-lib`, each one-sheet has exactly 1 page and each tech sheet has exactly 1 page; each is under 3 000 000 bytes.
- [ ] **Step 2: Run** `npm test && npm run test:e2e -- print`. Expected: FAIL.
- [ ] **Step 3: Implement.** `Print.astro` is A4 with `@page { size: A4; margin: 12mm }`, white paper and black ink for both; the one-sheet follows the flyer look, the tech sheet stays plain. `StagePlot.astro` draws from `plot` in SVG. `build-pdfs.mjs` starts `astro preview`, prints each route with Playwright `page.pdf({ format: 'A4', printBackground: true })`, and writes the four files. QR code encodes `SITE.url + '/' + lang + '/'`.
- [ ] **Step 4: Run** `npm run pdfs && npm test && npm run test:e2e`. Expected: PASS, whole suite.
- [ ] **Step 5: Look at the four PDFs** and fix anything cut off or crowded.
- [ ] **Step 6: Commit** `feat: generated one-sheets and tech sheets`, including the four PDFs.

### Task 7: Real content

**Files:**
- Modify: `src/content/shared.ts`, `src/content/fr.ts`, `src/content/en.ts`

This task needs the owner. Nothing here is invented.

- [ ] **Step 1: Collect.** Through the owner's logged-in browser, read the remaining Instagram posts and the Facebook page for: show dates with venue and co-billed bands, further press, live photos and video, photographer credit. Fetch the bastonne.fr article URL and the "Du son, des mots" post URL.
- [ ] **Step 2: Draft the bios** in French and English, short (about 50 words) and long (about 150), from the Word pitch in `resources/private/` and the spec's working timeline. No "a few weeks ago", no "for several years": dates. Keep the band's own strongest line about the sound.
- [ ] **Step 3: Show the owner** the bios, the show list and the quotes, and ask the open items from the spec: "for fans of", EP credits, set length, where the album stands, photographer credit, vector logos.
- [ ] **Step 4: Enter what is approved.** Set `confirmed: true` only on shows the owner confirms. Remove every `DRAFT` marker.
- [ ] **Step 5: Run** `npm run pdfs && npm test && npm run test:e2e`. Expected: PASS. Update the two seed-content assertions in Tasks 3 and 6 that expected empty fields, for whichever fields are now filled.
- [ ] **Step 6: Commit** `content: approved bios, shows and press`.

### Task 8: Publish (needs the owner's explicit go-ahead at each marked step)

**Files:**
- Create: `.github/workflows/deploy.yml`, `public/CNAME`, `README.md`

- [x] **Step 1: Write the workflow.** Trigger: push to `main` and manual dispatch. One job with `if: github.event.repository.private == false`, steps: checkout, setup-node with npm cache, `npm ci`, `npm run build`, `actions/upload-pages-artifact` on `dist`, then `actions/deploy-pages`. No Playwright install and no tests in the workflow. `public/CNAME` contains `hilldale.band`.
- [x] **Step 2: Write `README.md`:** where each piece of content lives, how to add a show or a quote, `npm run pdfs` after any content change, `npm test && npm run test:e2e` before pushing, and how publishing works.
- [x] **Step 3: Verify nothing private is tracked:** `git log --all --name-only --format= | sort -u | grep -iE 'private|fiche technique v5|PRÉSENTATION'` prints nothing. Commit.
- [ ] **Step 4 (owner go-ahead):** the owner registers `hilldale.band` and sets the DNS records GitHub Pages documents for an apex domain plus `www`.
- [ ] **Step 5 (owner go-ahead, irreversible):** delete `MD4/epk-hilldale` on GitHub, recreate it as public, push `main`. This is what guarantees the public repo never held the old commit.
- [ ] **Step 6:** enable Pages with source "GitHub Actions", set the custom domain, enforce HTTPS once the certificate is issued.
- [ ] **Step 7: Verify live:** `https://hilldale.band/` redirects, both languages load, the ZIP and all four PDFs download, the QR code on a one-sheet opens the page.
