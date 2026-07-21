import { useCallback, useRef, useState } from 'react';

import {
  SearchError,
  getErrorMessage,
  searchCharacters,
  type SearchCharactersResult,
} from '../../api';
import { createAbortableRequest } from '../../lib/abortable-request';
import { CharactersResponse } from '../../types';
import { buildSearchCharactersInput } from './search-params';

interface RequestCharactersOptions {
  clearResults?: boolean;
}

function toCharactersResponse(
  result: SearchCharactersResult,
): CharactersResponse {
  return {
    results: result.items,
    total: result.total,
    page: result.page,
    limit: result.pageSize,
    next: null,
    previous: null,
  };
}

export function useCharacterSearch() {
  const [charactersResponse, setCharactersResponse] =
    useState<CharactersResponse | null>(null);
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const requestControllerRef = useRef(createAbortableRequest());

  const requestCharacters = useCallback(
    async (
      name: string,
      nextPage: number,
      { clearResults = false }: RequestCharactersOptions = {},
    ) => {
      const { id: requestId, signal } = requestControllerRef.current.next();

      setSubmittedQuery(name);
      setPage(nextPage);
      setIsLoading(true);
      setError(null);
      // New searches clear prior results so the initial loading state shows.
      // Pagination keeps the current cards visible until the next page replaces them.
      if (clearResults) {
        setCharactersResponse(null);
      }

      try {
        const result = await searchCharacters(
          buildSearchCharactersInput(name, nextPage, signal),
        );
        if (!requestControllerRef.current.isCurrent(requestId)) {
          return;
        }
        setCharactersResponse(toCharactersResponse(result));
        setPage(result.page);
      } catch (err) {
        if (!requestControllerRef.current.isCurrent(requestId)) {
          return;
        }
        if (err instanceof SearchError && err.code === 'request_aborted') {
          return;
        }
        setCharactersResponse(null);
        setError(getErrorMessage(err) || 'Request failed');
      } finally {
        if (requestControllerRef.current.isCurrent(requestId)) {
          setIsLoading(false);
        }
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
      if (!submittedQuery || isLoading) {
        return;
      }
      requestCharacters(submittedQuery, nextPage);
    },
    [isLoading, requestCharacters, submittedQuery],
  );

  const handleRetry = useCallback(() => {
    if (!submittedQuery || isLoading) {
      return;
    }
    requestCharacters(submittedQuery, page);
  }, [isLoading, page, requestCharacters, submittedQuery]);

  const handleClearSearch = useCallback(() => {
    // Abort + invalidate so a late response cannot overwrite idle state.
    requestControllerRef.current.invalidate();
    setSubmittedQuery('');
    setCharactersResponse(null);
    setPage(1);
    setError(null);
    setIsLoading(false);
  }, []);

  const hasResults =
    charactersResponse !== null && charactersResponse.results.length > 0;
  const isEmptyResponse =
    charactersResponse !== null && charactersResponse.results.length === 0;
  const isInitialLoading = isLoading && !hasResults;
  const isPageLoading = isLoading && hasResults;
  const resultsResponse = hasResults ? charactersResponse : null;

  return {
    charactersResponse,
    submittedQuery,
    isLoading,
    error,
    page,
    hasResults,
    isEmptyResponse,
    isInitialLoading,
    isPageLoading,
    resultsResponse,
    handleSearch,
    handlePageChange,
    handleRetry,
    handleClearSearch,
  };
}
