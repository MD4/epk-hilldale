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
  expect(dump).not.toMatch(/(\+33|0)[1-9]([ .]?\d{2}){4}/);
});

test('exactly one featured video', () => {
  expect(getContent('fr').shared.videos.filter((v) => v.featured)).toHaveLength(1);
});

test('otherLang', () => {
  expect(otherLang('fr')).toBe('en');
  expect(otherLang('en')).toBe('fr');
});
