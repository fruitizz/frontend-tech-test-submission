import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  ApiError,
  getCharacters,
  getErrorMessage,
  getReactions,
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
    );
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
    expect(fetchMock).toHaveBeenCalledWith('/api/reactions');
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

describe('getErrorMessage', () => {
  it('returns ApiError messages for UI display', () => {
    expect(getErrorMessage(new ApiError('Network request failed', 'network'))).toBe(
      'Network request failed',
    );
  });

  it('hides unknown thrown values behind a stable fallback', () => {
    expect(getErrorMessage('boom')).toBe('Request failed');
    expect(getErrorMessage(new TypeError('Failed to fetch'))).toBe('Request failed');
  });
});
