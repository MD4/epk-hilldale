import { expect, test } from 'vitest';
import { splitShows } from '../src/lib/shows';

const show = (date: string, confirmed = true) => ({ date, city: 'Nantes', confirmed });

test('shows on or after today are upcoming, soonest first', () => {
  const { upcoming } = splitShows([show('2027-01-30'), show('2026-12-09'), show('2026-11-13')], '2026-12-09');
  expect(upcoming.map((s) => s.date)).toEqual(['2026-12-09', '2027-01-30']);
});

test('earlier shows are past, most recent first', () => {
  const { past } = splitShows([show('2025-11-29'), show('2026-11-13'), show('2026-12-09')], '2026-12-09');
  expect(past.map((s) => s.date)).toEqual(['2026-11-13', '2025-11-29']);
});

test('unconfirmed shows are left out of both lists', () => {
  const { upcoming, past } = splitShows([show('2027-01-30', false), show('2025-01-01', false)], '2026-12-09');
  expect([...upcoming, ...past]).toEqual([]);
});
