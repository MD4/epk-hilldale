import type { Shared } from './types';

// Every fact about the band lives here. Text that changes with language lives in fr.ts and en.ts.
export const shared: Shared = {
  // Set indexable to true to let search engines list the page.
  SITE: { url: 'https://hilldale.band', indexable: false },
  booking: { name: 'Jojo', email: 'hilldaledowntempo44@gmail.com' },
  links: {
    instagram: 'https://www.instagram.com/hilldale_band/',
    facebook: 'https://www.facebook.com/Hilldale.band/',
    bandcamp: 'https://hilldale44.bandcamp.com/album/hilldale',
    spotify: 'https://open.spotify.com/artist/2EyrghTIegnNTZAvIIMzvA',
    deezer: 'https://www.deezer.com/fr/artist/346979681',
    youtube: 'https://www.youtube.com/watch?v=4ll4Ep1TsqI',
  },
  // `photo` is the promo photo shown on the tile until the visitor presses play.
  videos: [
    { id: '4ll4Ep1TsqI', title: 'Regarde', featured: true, photo: 'hilldale-promo-09.jpg' },
    { id: 'xripHM9u9F4', title: 'Agonie', photo: 'hilldale-promo-10.jpg' },
    { id: 'nK1wYC-rL4E', title: 'Addictions', photo: 'hilldale-promo-01.jpg' },
  ],
  ep: {
    title: 'Hilldale',
    released: '2025-10-31',
    bandcampUrl: 'https://hilldale44.bandcamp.com/album/hilldale',
    // The number in Bandcamp's embed code for the EP; it puts the player on the page.
    bandcampAlbumId: '2247878127',
  },
  members: [
    { name: 'Jojo', role: 'vocals' },
    { name: 'Suli', role: 'guitar' },
    { name: 'Leo', role: 'bass' },
    { name: 'Marty', role: 'drums' },
  ],
  // A quote is only shown with its source and date. Add `url` when the article link is known.
  press: [
    {
      source: 'bastonne.fr',
      date: '2026-02-25',
      quote: {
        fr: 'Un hardcore sombre et viscéral, nourri d’influences post-metal, death et black metal.',
        en: 'Dark, visceral hardcore fed by post-metal, death and black metal.',
      },
    },
    {
      source: 'Du son, des mots',
      date: '2026-03',
      quote: { fr: 'Une entité à suivre de près.', en: 'One to watch closely.' },
    },
  ],
  // Only shows with confirmed: true appear on the page.
  shows: [
    { date: '2026-10-14', city: 'Limoges', venue: 'Dropkick', with: 'UNSAFE', confirmed: false },
    { date: '2026-10-15', city: 'Toulouse', venue: 'Mécanique des Fluides', with: 'UNSAFE', confirmed: false },
    { date: '2026-10-17', city: 'Peyrestortes', venue: 'El Paseo', with: 'UNSAFE', confirmed: false },
    { date: '2026-11-13', city: 'Nantes', venue: 'Poum Poum T’chak', with: 'Cendres', confirmed: false },
  ],
  photos: [
    {
      file: 'hilldale-promo-12.jpg',
      alt: {
        fr: 'Hilldale assis sur des marches de pierre sous un ciel blanc',
        en: 'Hilldale sitting on stone steps under a white sky',
      },
    },
    {
      file: 'hilldale-promo-10.jpg',
      alt: {
        fr: 'Hilldale debout devant un mur de béton strié',
        en: 'Hilldale standing in front of a ribbed concrete wall',
      },
    },
    {
      file: 'hilldale-promo-09.jpg',
      alt: {
        fr: 'Les quatre membres de Hilldale, plan rapproché devant un mur de béton',
        en: 'The four members of Hilldale, close up, in front of a concrete wall',
      },
    },
    {
      file: 'hilldale-promo-01.jpg',
      alt: {
        fr: 'Les quatre membres de Hilldale en silhouette sous une verrière',
        en: 'The four members of Hilldale in silhouette under a glass vault',
      },
    },
  ],
  logos: [
    { file: 'hilldale-wordmark-black.png', label: { fr: 'Typo noire', en: 'Wordmark, black' } },
    { file: 'hilldale-wordmark-white.png', label: { fr: 'Typo blanche', en: 'Wordmark, white' } },
    { file: 'hilldale-symbol-black.png', label: { fr: 'Symbole noir', en: 'Symbol, black' } },
    { file: 'hilldale-symbol-white.png', label: { fr: 'Symbole blanc', en: 'Symbol, white' } },
  ],
  heroPhoto: 'hilldale-promo-12.jpg',
  forFansOf: [],
};
