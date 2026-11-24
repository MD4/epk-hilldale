export type Lang = 'fr' | 'en';
export type Role = 'vocals' | 'guitar' | 'bass' | 'drums';

export interface Shared {
  SITE: { url: string; indexable: boolean };
  booking: { name: string; email: string };
  links: Record<'instagram' | 'facebook' | 'bandcamp' | 'spotify' | 'deezer' | 'youtube', string>;
  videos: { id: string; title: string; featured?: true; photo: string }[];
  ep: {
    title: string;
    released: string;
    bandcampUrl: string;
    bandcampAlbumId?: string;
    credits?: Partial<Record<'recording' | 'mix' | 'master' | 'artwork', string>>;
  };
  members: { name: string; role: Role }[];
  press: { source: string; date: string; url?: string; quote: { fr: string; en?: string } }[];
  shows: { date: string; city: string; venue?: string; with?: string; confirmed: boolean }[];
  photos: { file: string; credit?: string; alt: Record<Lang, string> }[];
  logos: { file: string; label: Record<Lang, string> }[];
  heroPhoto: string;
  forFansOf: string[];
  setLengthMinutes?: number;
}

export interface Strings {
  metaDescription: string;
  tagline: string;
  bioShort: string;
  bioLong: string;
  pressKit: string;
  bookTheBand: string;
  pressKitZip: string;
  outNow: string;
  lineup: string;
  press: string;
  booking: string;
  listenWatch: string;
  officialVideo: string;
  playEp: string;
  bio: string;
  readMore: string;
  copy: string;
  copied: string;
  photosLogos: string;
  photos: string;
  logos: string;
  download: string;
  technical: string;
  techSheet: string;
  oneSheet: string;
  techSummaryBand: string;
  techSummaryTrack: string;
  techSummaryLights: string;
  setLength: string;
  minutes: string;
  contactLinks: string;
  shows: string;
  showsWith: string;
  forFansOf: string;
  photoCredit: string;
  roleVocals: string;
  roleGuitar: string;
  roleBass: string;
  roleDrums: string;
  otherLangLabel: string;
}

export interface Content {
  lang: Lang;
  shared: Shared;
  t: Strings;
}
