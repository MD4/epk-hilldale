import type { Shared } from '../content/types';

type Show = Shared['shows'][number];

/** Today's date as 'YYYY-MM-DD' in local time. */
export function todayIso(now = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/**
 * Confirmed shows split around a date: upcoming soonest first, past most recent first.
 * A show on the day itself still counts as upcoming.
 */
export function splitShows(shows: Show[], today: string): { upcoming: Show[]; past: Show[] } {
  const confirmed = shows.filter((show) => show.confirmed);
  return {
    upcoming: confirmed.filter((s) => s.date >= today).sort((a, b) => a.date.localeCompare(b.date)),
    past: confirmed.filter((s) => s.date < today).sort((a, b) => b.date.localeCompare(a.date)),
  };
}
