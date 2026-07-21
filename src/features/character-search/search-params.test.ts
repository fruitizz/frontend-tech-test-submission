import { describe, expect, it } from 'vitest';

import { buildGetCharactersParams, PAGE_SIZE } from './search-params';

describe('PAGE_SIZE', () => {
  it('matches the API page size used for character search', () => {
    expect(PAGE_SIZE).toBe(4);
  });
});

describe('buildGetCharactersParams', () => {
  it('builds params from name and page', () => {
    expect(buildGetCharactersParams('sky', 2)).toEqual({
      name: 'sky',
      page: 2,
      limit: PAGE_SIZE,
    });
  });
});
