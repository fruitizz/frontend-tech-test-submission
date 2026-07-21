import { afterEach, describe, expect, it, vi } from 'vitest';

import { ApiError, getCharacters, getReactions } from './index';

describe('api client', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('requests characters with name, page and limit', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [],
        total: 0,
        page: 1,
        limit: 4,
        next: null,
        previous: null,
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await getCharacters({ name: 'sky', page: 1, limit: 4 });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/characters?name=sky&page=1&limit=4',
    );
  });

  it('throws ApiError for failed character responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      }),
    );

    await expect(
      getCharacters({ name: 'sky', page: 1, limit: 4 }),
    ).rejects.toBeInstanceOf(ApiError);
  });

  it('requests reactions', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ reactions: [] }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(getReactions()).resolves.toEqual({ reactions: [] });
    expect(fetchMock).toHaveBeenCalledWith('/api/reactions');
  });
});
