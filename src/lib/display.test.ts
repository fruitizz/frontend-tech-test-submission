import { describe, expect, it } from 'vitest';

import { hasDisplayValue } from './display';

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
