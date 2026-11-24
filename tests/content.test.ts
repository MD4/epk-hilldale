import { expect, test } from 'vitest';
import { getContent, LANGS, otherLang } from '../src/lib/content';

test('both languages define the same string keys', () => {
  expect(Object.keys(getContent('fr').t).sort()).toEqual(Object.keys(getContent('en').t).sort());
});

test('no string is empty', () => {
  for (const l of LANGS) for (const v of Object.values(getContent(l).t)) expect(v.trim()).not.toBe('');
});

test('bio lengths', () => {
  for (const l of LANGS) {
    const { bioShort, bioLong } = getContent(l).t;
    expect(bioShort.split(/\s+/).length).toBeLessThanOrEqual(60);
    expect(bioLong.split(/\s+/).length).toBeLessThanOrEqual(170);
  }
});

test('every press quote has a source and an ISO date', () => {
  for (const p of getContent('fr').shared.press) {
    expect(p.source).not.toBe('');
    expect(p.date).toMatch(/^\d{4}-\d{2}(-\d{2})?$/);
  }
});

test('no phone number anywhere in content', () => {
  const dump = JSON.stringify(LANGS.map(getContent));
  expect(dump).not.toMatch(/(\+33[ .-]?|0)[1-9]([ .-]?\d{2}){4}/);
});

test('exactly one featured video', () => {
  expect(getContent('fr').shared.videos.filter((v) => v.featured)).toHaveLength(1);
});

test('otherLang', () => {
  expect(otherLang('fr')).toBe('en');
  expect(otherLang('en')).toBe('fr');
});

import { getTech } from '../src/content/tech';

test('the patch list has channels 1 to 13 in both languages', () => {
  for (const l of LANGS) expect(getTech(l).patch.map((p) => p.ch)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
});

test('the stage plot has the same items in both languages', () => {
  expect(getTech('fr').plot.length).toBe(getTech('en').plot.length);
  expect(getTech('fr').plot.length).toBeGreaterThan(0);
});

test('the tech sheet names a contact by email and never by phone', () => {
  for (const l of LANGS) {
    const dump = JSON.stringify(getTech(l));
    expect(dump).not.toMatch(/(\+33|0)[1-9]([ .]?\d{2}){4}/);
    expect(getTech(l).contact.email).toMatch(/^[^@\s]+@[^@\s]+$/);
  }
});

import { isPublishable } from '../scripts/publishable.mjs';

test('only image files are published from resources', () => {
  expect(isPublishable('hilldale-promo-01.jpg')).toBe(true);
  expect(isPublishable('hilldale-symbol-black.png')).toBe(true);
  expect(isPublishable('.DS_Store')).toBe(false);
  expect(isPublishable('notes.docx')).toBe(false);
});
