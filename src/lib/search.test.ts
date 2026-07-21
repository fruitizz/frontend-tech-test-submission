import { describe, expect, it } from 'vitest';

import { normalizeSearchQuery } from './search';

describe('normalizeSearchQuery', () => {
  it('trims surrounding whitespace', () => {
    expect(normalizeSearchQuery('  sky  ')).toBe('sky');
  });

  it('returns an empty string for whitespace-only input', () => {
    expect(normalizeSearchQuery('')).toBe('');
    expect(normalizeSearchQuery('   ')).toBe('');
  });
});
