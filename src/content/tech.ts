import type { Lang } from './types';

// The tech sheet, transcribed from the band's own sheet (v5). It states the band's terms
// and adds none: change a line here only when the band changes it.

type Text = Record<Lang, string>;
type PlotKind = 'amp' | 'drums' | 'mic' | 'monitor' | 'power' | 'person';

export interface TechSheet {
  version: string;
  updated: string;
  party: string[];
  patch: { ch: number; source: string; mic: string }[];
  providedByVenue: string[];
  lights: string;
  hospitality: { stage: string; backstage: string };
  contact: { name: string; role: string; email: string };
  plot: { label: string; note?: string; x: number; y: number; kind: PlotKind }[];
  labels: Record<
    | 'title' | 'stagePlot' | 'stageRight' | 'audience' | 'patch' | 'channel' | 'source' | 'mic'
    | 'party' | 'providedByVenue' | 'lights' | 'hospitality' | 'stage' | 'backstage' | 'contact'
    | 'booking' | 'updated' | 'setLength',
    string
  >;
}

const HOUSE: Text = { fr: 'Matériel présent sur site', en: 'House microphones' };

const patch: { ch: number; source: Text; mic: Text }[] = [
  { ch: 1, source: { fr: 'Kick', en: 'Kick' }, mic: { fr: 'Shure Beta 52', en: 'Shure Beta 52' } },
  { ch: 2, source: { fr: 'Sample 1 (ligne)', en: 'Sample 1 (line)' }, mic: { fr: 'Kick trigger', en: 'Kick trigger' } },
  { ch: 3, source: { fr: 'Sample 2 (ligne)', en: 'Sample 2 (line)' }, mic: { fr: 'Samples', en: 'Samples' } },
  {
    ch: 4,
    source: { fr: 'Sample 3 (ligne)', en: 'Sample 3 (line)' },
    mic: {
      fr: 'Bande (2e guitare, pan à cour / droite)',
      en: 'Backing track (2nd guitar, panned house right)',
    },
  },
  { ch: 5, source: { fr: 'Snare', en: 'Snare' }, mic: HOUSE },
  { ch: 6, source: { fr: 'Hi-hat', en: 'Hi-hat' }, mic: HOUSE },
  { ch: 7, source: { fr: 'High tom', en: 'High tom' }, mic: HOUSE },
  { ch: 8, source: { fr: 'Floor tom', en: 'Floor tom' }, mic: HOUSE },
  { ch: 9, source: { fr: 'OH gauche', en: 'OH left' }, mic: HOUSE },
  { ch: 10, source: { fr: 'OH droite', en: 'OH right' }, mic: HOUSE },
  { ch: 11, source: { fr: 'Basse', en: 'Bass' }, mic: HOUSE },
  {
    ch: 12,
    source: { fr: 'Guitare', en: 'Guitar' },
    mic: { fr: 'Shure SM57 / Sennheiser e609 ou MD421', en: 'Shure SM57 / Sennheiser e609 or MD421' },
  },
  { ch: 13, source: { fr: 'Voix', en: 'Vocals' }, mic: { fr: 'Shure SM58', en: 'Shure SM58' } },
];

// Positions in percent of the stage: x from stage right (jardin) to stage left, y from upstage to the audience.
const plot: { label: Text; note?: Text; x: number; y: number; kind: PlotKind }[] = [
  { label: { fr: 'Ampli guitare', en: 'Guitar amp' }, note: { fr: 'micro', en: 'mic' }, x: 18, y: 16, kind: 'amp' },
  {
    label: { fr: 'Marty', en: 'Marty' },
    note: { fr: 'Batterie (droitier) + 3 lignes', en: 'Drums (right-handed) + 3 lines' },
    x: 50,
    y: 18,
    kind: 'drums',
  },
  { label: { fr: 'Ampli basse', en: 'Bass amp' }, note: { fr: 'micro', en: 'mic' }, x: 82, y: 16, kind: 'amp' },
  { label: { fr: 'Alim. FX', en: 'Power (FX)' }, x: 50, y: 4, kind: 'power' },
  { label: { fr: 'Suli', en: 'Suli' }, note: { fr: 'Guitare', en: 'Guitar' }, x: 18, y: 50, kind: 'person' },
  { label: { fr: 'Jojo', en: 'Jojo' }, note: { fr: 'Chant, micro', en: 'Vocals, mic' }, x: 50, y: 50, kind: 'person' },
  { label: { fr: 'Leo', en: 'Leo' }, note: { fr: 'Basse', en: 'Bass' }, x: 82, y: 50, kind: 'person' },
  { label: { fr: 'Alim. FX', en: 'Power (FX)' }, x: 18, y: 68, kind: 'power' },
  { label: { fr: 'Alim. FX', en: 'Power (FX)' }, x: 82, y: 68, kind: 'power' },
  { label: { fr: 'Retour', en: 'Monitor' }, x: 18, y: 86, kind: 'monitor' },
  { label: { fr: 'Retour', en: 'Monitor' }, x: 50, y: 86, kind: 'monitor' },
  { label: { fr: 'Retour', en: 'Monitor' }, x: 82, y: 86, kind: 'monitor' },
];

const text = {
  party: {
    fr: ['1 chanteur', '1 batteur', '1 bassiste', '1 guitariste', '1 merch'],
    en: ['1 vocalist', '1 drummer', '1 bassist', '1 guitarist', '1 merch'],
  },
  providedByVenue: {
    fr: ['1 backline batterie complet', '1 baffle guitare', '1 baffle basse'],
    en: ['1 full drum backline', '1 guitar cabinet', '1 bass cabinet'],
  },
  lights: {
    fr: 'Gérées en autonomie (matériel monté par nos soins et préprogrammé) : 6 Cameo Thunder Wash (strobe / blinder / wash), 1 machine à fumée Stairville AF-250.',
    en: 'Run by the band (we rig our own pre-programmed kit): 6 Cameo Thunder Wash (strobe / blinder / wash), 1 Stairville AF-250 fog machine.',
  },
  hospitality: {
    fr: {
      stage: 'Bouteilles d’eau tempérée et bières fraîches.',
      backstage: 'Repas complet et bières fraîches pour l’ensemble des membres.',
    },
    en: {
      stage: 'Room-temperature water bottles and cold beers.',
      backstage: 'A full meal and cold beers for the whole party.',
    },
  },
  role: { fr: 'guitare', en: 'guitar' },
  labels: {
    fr: {
      title: 'Fiche technique',
      stagePlot: 'Plan de scène',
      stageRight: 'Jardin',
      audience: 'Fosse',
      patch: 'Patch',
      channel: 'N°',
      source: 'Source',
      mic: 'Micro / entrée',
      party: 'Équipe : 5 personnes',
      providedByVenue: 'À fournir par l’organisation',
      lights: 'Lumières',
      hospitality: 'Catering',
      stage: 'Scène',
      backstage: 'Loge',
      contact: 'Contact technique',
      booking: 'Booking',
      updated: 'Mise à jour',
      setLength: 'Durée du set',
    },
    en: {
      title: 'Tech rider',
      stagePlot: 'Stage plot',
      stageRight: 'Stage right',
      audience: 'Audience',
      patch: 'Input list',
      channel: 'Ch',
      source: 'Source',
      mic: 'Mic / input',
      party: 'Touring party: 5 people',
      providedByVenue: 'To be provided by the venue',
      lights: 'Lights',
      hospitality: 'Hospitality',
      stage: 'Stage',
      backstage: 'Backstage',
      contact: 'Technical contact',
      booking: 'Booking',
      updated: 'Updated',
      setLength: 'Set length',
    },
  },
} as const;

export function getTech(lang: Lang): TechSheet {
  return {
    version: 'v5',
    updated: '2026-11-24',
    party: [...text.party[lang]],
    patch: patch.map((p) => ({ ch: p.ch, source: p.source[lang], mic: p.mic[lang] })),
    providedByVenue: [...text.providedByVenue[lang]],
    lights: text.lights[lang],
    hospitality: text.hospitality[lang],
    contact: { name: 'Suli', role: text.role[lang], email: 'suligreedreigns@gmail.com' },
    plot: plot.map((p) => ({ label: p.label[lang], note: p.note?.[lang], x: p.x, y: p.y, kind: p.kind })),
    labels: text.labels[lang],
  };
}
