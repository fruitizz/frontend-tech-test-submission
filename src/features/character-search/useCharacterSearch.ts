import { useCallback, useRef, useState } from 'react';

import { searchCharacters, toSearchError } from '../../api';
import { createAbortableRequest } from '../../lib/abortable-request';
import { buildSearchCharactersInput } from './search-params';
import {
  SearchResultsData,
  SearchViewState,
  deriveViewState,
  idleViewState,
} from './search-view-state';

interface RequestCharactersOptions {
  clearResults?: boolean;
}

export function useCharacterSearch() {
  const [state, setState] = useState<SearchViewState>(idleViewState);
  const requestControllerRef = useRef(createAbortableRequest());

  const requestCharacters = useCallback(
    async (
      name: string,
      nextPage: number,
      { clearResults = false }: RequestCharactersOptions = {},
    ) => {
      const { id: requestId, signal } = requestControllerRef.current.next();

      // New searches drop stale results so the initial loading state shows.
      // Pagination keeps the current page's data visible until it resolves.
      setState((previous) => {
        const previousResults = clearResults
          ? null
          : getResultsData(previous);
        return {
          status: 'loading',
          query: name,
          page: nextPage,
          previousResults,
        };
      });

      try {
        const result = await searchCharacters(
          buildSearchCharactersInput(name, nextPage, signal),
        );
        if (!requestControllerRef.current.isCurrent(requestId)) {
          return;
        }
        const data: SearchResultsData = {
          results: result.items,
          total: result.total,
          page: result.page,
          pageSize: result.pageSize,
        };
        setState(
          deriveViewState({ query: name, page: result.page, kind: 'result', data }),
        );
      } catch (err) {
        if (!requestControllerRef.current.isCurrent(requestId)) {
          return;
        }
        const error = toSearchError(err);
        if (error.code === 'request_aborted') {
          return;
        }
        setState(
          deriveViewState({ query: name, page: nextPage, kind: 'error', error }),
        );
      }
    },
    [],
  );

  const handleSearch = useCallback(
    (name: string) => {
      requestCharacters(name, 1, { clearResults: true });
    },
    [requestCharacters],
  );

  const handlePageChange = useCallback(
    (nextPage: number) => {
      if (state.status === 'loading' || state.status === 'idle') {
        return;
      }
      requestCharacters(state.query, nextPage);
    },
    [requestCharacters, state],
  );

  const handleRetry = useCallback(() => {
    if (state.status !== 'error') {
      return;
    }
    requestCharacters(state.query, state.page);
  }, [requestCharacters, state]);

  const handleClearSearch = useCallback(() => {
    // Abort + invalidate so a late response cannot overwrite idle state.
    requestControllerRef.current.invalidate();
    setState(idleViewState);
  }, []);

  return {
    state,
    handleSearch,
    handlePageChange,
    handleRetry,
    handleClearSearch,
  };
}

/** Best-known results for a state, used to keep cards visible while paginating. */
function getResultsData(state: SearchViewState): SearchResultsData | null {
  if (state.status === 'success') {
    return state.data;
  }
  if (state.status === 'loading') {
    return state.previousResults;
  }
  return null;
}
