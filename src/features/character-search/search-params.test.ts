import { describe, expect, it } from 'vitest';

import { buildSearchCharactersInput, PAGE_SIZE } from './search-params';

describe('buildSearchCharactersInput', () => {
  it('builds a search input with the fixed page size', () => {
    expect(buildSearchCharactersInput('sky', 2)).toEqual({
      query: 'sky',
      page: 2,
      pageSize: PAGE_SIZE,
      signal: undefined,
    });
  });

  it('forwards an abort signal when provided', () => {
    const signal = new AbortController().signal;
    expect(buildSearchCharactersInput('sky', 1, signal).signal).toBe(signal);
  });
});
