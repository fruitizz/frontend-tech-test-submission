import { describe, expect, it } from 'vitest';

import { buildPageItems, getTotalPages } from './pagination';

describe('getTotalPages', () => {
  it('computes pages from total and limit', () => {
    expect(getTotalPages(5, 4)).toBe(2);
    expect(getTotalPages(8, 4)).toBe(2);
    expect(getTotalPages(4, 4)).toBe(1);
  });

  it('never returns fewer than one page', () => {
    expect(getTotalPages(0, 4)).toBe(1);
  });
});

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
