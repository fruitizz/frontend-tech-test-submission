/** Trim and reject whitespace-only search input before submit. */
export const normalizeSearchQuery = (value: string): string => value.trim();
