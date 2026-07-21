import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  ApiError,
  SearchError,
  getCharacterReactions,
  getCharacters,
  getErrorMessage,
  getReactions,
  searchCharacters,
  toSearchError,
} from './index';

describe('api client', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('requests characters with name, page and limit', async () => {
    const payload = {
      results: [],
      total: 0,
      page: 1,
      limit: 4,
      next: null,
      previous: null,
    };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => payload,
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(
      getCharacters({ name: 'sky', page: 1, limit: 4 }),
    ).resolves.toEqual(payload);

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/characters?name=sky&page=1&limit=4',
      undefined,
    );
  });

  it('searchCharacters returns a feature-facing result shape', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          results: [{ id: 1, name: 'Luke', affiliations: [] }],
          total: 1,
          page: 1,
          limit: 4,
          next: null,
          previous: null,
        }),
      }),
    );

    await expect(
      searchCharacters({ query: 'sky', page: 1, pageSize: 4 }),
    ).resolves.toEqual({
      items: [{ id: 1, name: 'Luke', affiliations: [] }],
      total: 1,
      page: 1,
      pageSize: 4,
    });
  });

  it('searchCharacters forwards AbortSignal to fetch', async () => {
    const signal = new AbortController().signal;
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

    await searchCharacters({ query: 'sky', page: 1, pageSize: 4, signal });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/characters?name=sky&page=1&limit=4',
      { signal },
    );
  });

  it('searchCharacters maps network failures to SearchError codes', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new TypeError('Failed to fetch')),
    );

    await expect(
      searchCharacters({ query: 'sky', page: 1, pageSize: 4 }),
    ).rejects.toMatchObject({
      name: 'SearchError',
      code: 'network_error',
    });
  });

  it('searchCharacters maps aborted fetch to request_aborted', async () => {
    const abortError = new DOMException('Aborted', 'AbortError');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(abortError));

    await expect(
      searchCharacters({ query: 'sky', page: 1, pageSize: 4 }),
    ).rejects.toMatchObject({
      name: 'SearchError',
      code: 'request_aborted',
    });
  });

  it('encodes special characters in the name query param', async () => {
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

    await getCharacters({ name: 'darth vader & co', page: 2, limit: 4 });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/characters?name=darth+vader+%26+co&page=2&limit=4',
      undefined,
    );
  });

  it('throws ApiError for failed character HTTP responses', async () => {
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
    ).rejects.toMatchObject({
      name: 'ApiError',
      kind: 'http',
      status: 500,
      message: 'API request failed: 500 Internal Server Error',
    });
  });

  it('wraps rejected fetch as a network ApiError', async () => {
    const cause = new TypeError('Failed to fetch');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(cause));

    const error = await getCharacters({
      name: 'sky',
      page: 1,
      limit: 4,
    }).catch((err) => err);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      kind: 'network',
      message: 'Network request failed',
      status: undefined,
    });
    expect(error.cause).toBe(cause);
  });

  it('wraps invalid JSON as a parse ApiError', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => {
          throw new SyntaxError('Unexpected token');
        },
      }),
    );

    await expect(getReactions()).rejects.toMatchObject({
      name: 'ApiError',
      kind: 'parse',
      status: 200,
      message: 'Invalid API response',
    });
  });

  it('requests reactions', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ reactions: [] }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(getReactions()).resolves.toEqual({ reactions: [] });
    expect(fetchMock).toHaveBeenCalledWith('/api/reactions', undefined);
  });

  it('getCharacterReactions filters active reactions for one character', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          reactions: [
            { id: 'a', content: '👍', characterId: 1, deleted: false },
            { id: 'b', content: '👎', characterId: 1, deleted: true },
            { id: 'c', content: '❤️', characterId: 2, deleted: false },
          ],
        }),
      }),
    );

    await expect(getCharacterReactions(1)).resolves.toEqual([
      { id: 'a', content: '👍', characterId: 1, deleted: false },
    ]);
  });

  it('throws ApiError for failed reaction HTTP responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
        statusText: 'Service Unavailable',
      }),
    );

    await expect(getReactions()).rejects.toMatchObject({
      name: 'ApiError',
      kind: 'http',
      status: 503,
    });
  });
});

describe('SearchError mapping', () => {
  it('maps ApiError kinds onto SearchError codes', () => {
    expect(toSearchError(new ApiError('n', 'network')).code).toBe(
      'network_error',
    );
    expect(toSearchError(new ApiError('p', 'parse')).code).toBe(
      'invalid_response',
    );
    expect(toSearchError(new ApiError('a', 'aborted')).code).toBe(
      'request_aborted',
    );
    expect(toSearchError(new ApiError('h', 'http', 500)).code).toBe(
      'unknown_error',
    );
  });

  it('getErrorMessage hides aborted failures', () => {
    expect(
      getErrorMessage(new SearchError('Request aborted', 'request_aborted')),
    ).toBe('');
    expect(
      getErrorMessage(new SearchError('Network request failed', 'network_error')),
    ).toBe('Network request failed');
    expect(getErrorMessage(new TypeError('Failed to fetch'))).toBe(
      'Request failed',
    );
  });
});
