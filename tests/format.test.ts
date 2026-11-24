import { expect, test } from 'vitest';
import { formatDate } from '../src/lib/format';

test('full dates read day.month.year', () => {
  expect(formatDate('2025-10-31')).toBe('31.10.2025');
});

test('month-only dates read month.year', () => {
  expect(formatDate('2026-03')).toBe('03.2026');
});
