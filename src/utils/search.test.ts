import { describe, expect, it } from 'vitest';

import { hasDisplayValue } from './display';
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

describe('hasDisplayValue', () => {
  it('accepts non-empty trimmed strings', () => {
    expect(hasDisplayValue('Luke')).toBe(true);
    expect(hasDisplayValue('  Leia  ')).toBe(true);
  });

  it('rejects empty or missing values', () => {
    expect(hasDisplayValue('')).toBe(false);
    expect(hasDisplayValue('   ')).toBe(false);
    expect(hasDisplayValue(undefined)).toBe(false);
    expect(hasDisplayValue(null)).toBe(false);
  });
});
