# HILLDALE EPK: design

Date: 2026-11-24. Status: approved by the band on 2026-11-24.

Lines marked **(call)** are choices made by the designer, not decisions the band agreed to. Lines marked **(open)** need an answer from the band.

## Intent

HILLDALE (dark hardcore, Nantes, four musicians) needs a professional electronic press kit to send to everyone who might need it: venue bookers, festival programmers, press, labels and sound engineers. Today the material is a Word pitch, four promo photos, logos and a tech sheet exported from a spreadsheet. The band wants one professional, practical thing to send, in French and English.

## Goals

- One short link that works on a phone and shows who the band is, what it sounds like and how to book it within the first screen.
- French and English versions of everything.
- A one-page PDF ("one-sheet") in each language for forms and people who want an attachment, generated from the same content as the page so they never disagree.
- Downloadable assets: photos, logos, tech sheet, and one ZIP with all of it.
- Updating a show date, a quote or a link means editing one content file.

## Non-goals

- A fan-facing band website (tour dates for fans, merch shop, newsletter).
- A CMS or admin screen. Updates go through the repo.
- A contact form. A visible email address is what bookers want.
- Analytics.

## Anti-goals

- Out-of-date information (the reason the PDF is generated, not hand-made).
- A template look that flattens the band's black-and-white identity.
- Inflated claims or unattributed quotes.
- A heavy page: the promo photos are 7 to 15 MB each and must never be served as-is in the page.

## Approaches considered

| | What | Trade-off |
|---|---|---|
| A. Hand-built static page | Static site in this repo, free hosting, own domain | Full control of the look, no monthly cost; updates go through the repo |
| B. Site builder | Bandzoogle / Squarespace / Wix EPK template | Any member can edit; monthly fee, template look, clumsy FR/EN |
| C. PDF only | Designed PDF in FR and EN | Fast; goes stale, heavy on mobile, no players |

The band picked **A**, with the one-page PDFs generated from the same content.

## Constraints

- The repo `MD4/epk-hilldale` is private until launch, then public. Source material lives in `resources/`.
- Booking contact, decided by the band: Jojo, hilldaledowntempo44@gmail.com. No phone number on the page **(call)**.
- The tech sheet names Suli as technical contact with a personal email and mobile number. The rebuilt tech sheet keeps Suli's email as technical contact and drops the mobile number unless the band asks to keep it **(call)**.
- Instagram and Facebook content can only be read through the owner's logged-in browser.

## Design

### Stack (call)

- **Astro**, static output, no client framework. It gives per-language routes, build-time image resizing and plain HTML output.
- Content in `src/content/`: one file of shared facts (links, shows, members, video ids) and one file per language for text (`fr`, `en`).
- **Hosting: GitHub Pages**, decided by the band, on the custom domain `hilldale.band` (the band's choice; to be registered by the band, availability not confirmed).
- One repo, decided by the band. `MD4/epk-hilldale` stays private while the site is built and previewed locally. At launch the repo is made public and GitHub Pages is switched on; the account is on GitHub Free, which serves Pages only from public repos.
- Once the repo is public, a GitHub Actions workflow deploys on every push to `main` (Actions minutes are free for public repos). No workflow runs while the repo is private: the account's included minutes for private repos were fully used in November 2026 **(call)**.
- Going public exposes the whole commit history. Before launch, nothing with personal data may exist in any commit: the original tech sheet PDF and spreadsheet (a member's mobile number) and the Word pitch are kept out of the repo, in an ignored `resources/private/` folder **(call)**. The design doc and plan become public too.
- The first commit was rewritten on 2026-11-24 to remove those files, but GitHub still serves the old commit to anyone who knows its hash. Launch step: publish from a freshly created repo (delete and recreate `MD4/epk-hilldale`, then push), so the public repo has never contained them.
- PDFs rendered with Playwright from dedicated print routes and committed, so the deploy workflow only has to build the site.

### URLs and language (call)

- `/fr/` and `/en/`. `/` redirects by browser language, falling back to English.
- A FR/EN toggle in the header that keeps the scroll position's section.
- The page is `noindex` at launch: it is a pro page shared by link, like UNSAFE's `/pro`. One flag flips this if the band wants it public.

### Page sections, in order

1. **Header**: cross symbol, wordmark, one line ("Dark hardcore from Nantes, France"), "for fans of" line **(open: which bands)**, booking email button, language toggle. One landscape-cropped promo photo behind or beside it.
2. **Listen and watch**: one featured clip (Agonie, Regarde or Addictions; **call: Regarde first, since the band pins it**) as a click-to-load YouTube embed, the two other clips as thumbnails, and the EP player (Bandcamp embed, with Spotify and Deezer links).
3. **Bio**: short version shown (about 50 words), "read more" opens the long one (about 150 words). A "copy text" button per version. Rewritten from the Word pitch, in both languages, for the band to approve.
4. **Press and live**: attributed quotes (bastonne.fr, 25 Feb 2026, plus any others found), and a list of notable shows (support for Coilguns, November 2025 tour, shows with UNSAFE). Each list hides itself when empty.
5. **Line-up**: Jojo (vocals), Suli (guitar), Leo (bass), Marty (drums). First names only **(call)**.
6. **Photos and logos**: grid of web-sized previews, each with a full-resolution download, plus logo files (symbol and wordmark, black and white). Photo credit shown when known **(open: photographer name)**.
7. **Technical**: tech sheet PDF in FR and EN, set length **(open)**, a three-line summary (4 musicians, backing track for second guitar, own lights), and "Download full press kit (ZIP)".
8. **Contact and links**: booking contact, Instagram, Facebook, Bandcamp, Spotify, Deezer, YouTube.

### Look

Picked by the band on 2026-11-24 from three mockups: take C, "Flyer". Reference mockups (desktop and phone): https://claude.ai/artifact/6KBZdgfsZ6NP9tGM6FPMzi, boards "C · Flyer".

- White paper (`#f2f2ef`) and black ink, like a gig poster. No colour, no gradients.
- Display type: Big Shoulders Display, weights 600 and 800, uppercase, for the tagline, headings, labels and buttons. Body type: Archivo.
- The wordmark image runs the full width across the hero photo and inverts against whatever is behind it (`mix-blend-mode: difference` on the white wordmark). The black cross sits small on the photo.
- Hero photo: the stairs shot under the white sky (`promo-12`), full width.
- Structure is drawn with rules, not cards: a 6 px black rule above and below the facts block, 2 px rules between columns and around tiles, a black bar at the very top for "Press kit" and the language toggle.
- Under the hero, a dense four-column facts block: tagline, release and line-up, press quotes, booking with the two buttons. On a phone it stacks, tagline and booking first.
- Clips are bordered photo tiles with the title in a black bar underneath.
- Primary buttons are solid black with white uppercase text; secondary buttons are a 2 px black outline.
- The one-sheet PDF uses the same flyer look. The tech sheet stays plain black on white.

### Generated files

- `hilldale-onesheet-fr.pdf`, `hilldale-onesheet-en.pdf`: one A4 page with photo, one-liner, short bio, top quote, key shows, links as clickable text and QR code to the page, booking contact.
- `hilldale-fiche-technique.pdf` and `hilldale-tech-rider.pdf`: the tech sheet rebuilt from data, fixing the current export (catering text cut off, blank second page, no date, no set length, French only). Stage plot redrawn as SVG.
- `hilldale-presskit.zip`: photos, logos, both tech sheets, both one-sheets, bios as text files. GitHub Pages accepts files up to 100 MB, so the ZIP carries the untouched originals (about 45 MB in total).

### Content already collected from Instagram

Read through the owner's logged-in browser on 2026-11-24. Collecting the rest (posts, Facebook) the same way is part of the build; everything collected is confirmed by the band before launch.

- The EP is self-titled: *Hilldale*, at `hilldale44.bandcamp.com/album/hilldale`. Released 31 October 2025 (confirmed by the band).
- Press, bastonne.fr, 25 Feb 2026, "Hilldale : un premier EP marquant et un album en préparation": "un hardcore sombre et viscéral, nourri d'influences post-metal, death et black metal". Article URL still to fetch.
- Press, Du son, des mots (Facebook post, around March 2026): "Une entité à suivre de près". Post URL still to fetch.
- Shows with UNSAFE: 14/10 Limoges (Dropkick), 15/10 Toulouse (Mécanique des Fluides), 17/10 Peyrestortes (El Paseo). 2026, inferred from the age of the Instagram story; to confirm.
- 13 November, Nantes, Poum Poum T'chak, with Cendres, presented by Avalanche Sessions. 2026, inferred the same way; to confirm.
- Instagram tagline: "Dark/Hardcore From Nantes, France".

The Word pitch dates from shortly after the EP release. Working timeline for the bios: EP out 31 October 2025; tour in November 2025; last 2025 show supporting Coilguns; reviews in February and March 2026; dates with UNSAFE in October 2026; Nantes with Cendres in November 2026; first album being written. The band confirms this timeline when it approves the bios.

### Content still owed by the band (open)

The page is built so each of these can be added later without redesign:

- EP credits (recording, mix, master, artwork).
- "For fans of" bands.
- Live video and live photos. Landscape promo or live shot if one exists.
- Other press quotes and the list of notable shows (to be collected from Instagram and Facebook, then confirmed).
- Photographer credit. Vector logo files if they exist.
- Set length.
- Where the album stands, for the last line of the bio.

The tech sheet's source spreadsheet is now in `resources/` with the full text (catering included). The rebuilt tech sheet copies the band's terms and adds none.

## Left to the builder

- Exact spacing and motion, within the look described above.
- Component breakdown and file layout inside the Astro project.
- Image sizes and formats for the web previews.
- How the ZIP and PDFs are wired into the build.

## Verification

- Page loads and reads correctly at phone and desktop width in both languages.
- Every download link returns the right file; the ZIP contains what the page says it does.
- The one-sheet PDFs are exactly one A4 page and their text matches the page content.
- Total page weight on first load stays under about 1.5 MB before any video is played.
