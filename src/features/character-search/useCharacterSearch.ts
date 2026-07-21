import { useCallback, useRef, useState } from 'react';

import { getCharacters, getErrorMessage } from '../../api';
import { createAbortableRequest } from '../../lib/abortable-request';
import { CharactersResponse } from '../../types';
import { buildGetCharactersParams } from './search-params';

interface RequestCharactersOptions {
  clearResults?: boolean;
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
      const requestId = requestControllerRef.current.next();

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
        const response = await getCharacters(
          buildGetCharactersParams(name, nextPage),
        );
        if (!requestControllerRef.current.isCurrent(requestId)) {
          return;
        }
        setCharactersResponse(response);
        setPage(response.page);
      } catch (err) {
        if (!requestControllerRef.current.isCurrent(requestId)) {
          return;
        }
        setCharactersResponse(null);
        setError(getErrorMessage(err));
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
    // Invalidate any in-flight character request so a late response is ignored.
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
