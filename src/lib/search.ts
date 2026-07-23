/** Trim and reject whitespace-only search input before submit. */
export const normalizeSearchQuery = (value: string): string => value.trim();

/**
 * True when `name` starts with `query`, case-insensitively.
 *
 * The brief requires results to be characters whose name starts with the
 * typed text — not an anywhere-in-string ("contains") match.
 */
export function nameStartsWithQuery(name: string, query: string): boolean {
  return name.toLowerCase().startsWith(query.toLowerCase());
}
