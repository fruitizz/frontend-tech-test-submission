import { describe, expect, it } from 'vitest';

import { SearchError } from '../../api';
import { deriveViewState, idleViewState } from './search-view-state';

const data = {
  results: [{ id: 1, name: 'Luke', affiliations: [] }],
  total: 1,
  page: 1,
  pageSize: 4,
};

describe('idleViewState', () => {
  it('is a plain idle status with no query', () => {
    expect(idleViewState).toEqual({ status: 'idle' });
  });
});

describe('deriveViewState', () => {
  it('builds a loading state with no previous results for a fresh search', () => {
    expect(
      deriveViewState({
        query: 'sky',
        page: 1,
        kind: 'loading',
        previousResults: null,
      }),
    ).toEqual({ status: 'loading', query: 'sky', page: 1, previousResults: null });
  });

  it('builds a loading state that carries stale results while paginating', () => {
    expect(
      deriveViewState({
        query: 'sky',
        page: 2,
        kind: 'loading',
        previousResults: data,
      }),
    ).toEqual({
      status: 'loading',
      query: 'sky',
      page: 2,
      previousResults: data,
    });
  });

  it('builds a success state when results are non-empty', () => {
    expect(
      deriveViewState({ query: 'sky', page: 1, kind: 'result', data }),
    ).toEqual({ status: 'success', query: 'sky', page: 1, data });
  });

  it('builds an empty state when results are empty', () => {
    const emptyData = { ...data, results: [], total: 0 };
    expect(
      deriveViewState({ query: 'zzz', page: 1, kind: 'result', data: emptyData }),
    ).toEqual({ status: 'empty', query: 'zzz', page: 1 });
  });

  it('builds an error state that never carries stale results', () => {
    const error = new SearchError('Network request failed', 'network_error');
    expect(
      deriveViewState({ query: 'sky', page: 2, kind: 'error', error }),
    ).toEqual({ status: 'error', query: 'sky', page: 2, error });
  });
});
