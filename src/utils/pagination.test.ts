import { describe, expect, it } from 'vitest';

import { buildPageItems } from './pagination';
import { hasDisplayValue } from './display';

describe('buildPageItems', () => {
  it('returns an empty list for non-positive page counts', () => {
    expect(buildPageItems(1, 0)).toEqual([]);
    expect(buildPageItems(1, -1)).toEqual([]);
  });

  it('lists every page when there are four or fewer', () => {
    expect(buildPageItems(1, 1)).toEqual([1]);
    expect(buildPageItems(2, 4)).toEqual([1, 2, 3, 4]);
  });

  it('collapses the middle of longer ranges with ellipsis', () => {
    expect(buildPageItems(1, 5)).toEqual([1, 2, 'ellipsis', 5]);
    expect(buildPageItems(5, 5)).toEqual([1, 'ellipsis', 4, 5]);
    expect(buildPageItems(3, 5)).toEqual([1, 2, 3, 4, 5]);
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
