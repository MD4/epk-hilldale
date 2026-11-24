/** '2025-10-31' -> '31.10.2025', '2026-03' -> '03.2026'. */
export function formatDate(iso: string): string {
  return iso.split('-').reverse().join('.');
}
