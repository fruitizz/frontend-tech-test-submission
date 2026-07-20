import React, { useEffect, useRef, useState } from 'react';

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

import { Header } from '../Header';
import { Content } from '../Content';
import { getCharacters, getReactions } from '../../api';
import { CharactersResponse, Reaction } from '../../types';

const PAGE_SIZE = 4;

function groupActiveReactionsByCharacterId(
  reactions: Reaction[],
): Record<number, Reaction[]> {
  const byCharacterId: Record<number, Reaction[]> = {};

  for (const reaction of reactions) {
    if (reaction.deleted) {
      continue;
    }

    const list = byCharacterId[reaction.characterId] ?? [];
    list.push(reaction);
    byCharacterId[reaction.characterId] = list;
  }

  return byCharacterId;
}

export const App: React.FC = () => {
  const [charactersResponse, setCharactersResponse] = useState<CharactersResponse | null>(null);
  const [reactionsByCharacterId, setReactionsByCharacterId] = useState<
    Record<number, Reaction[]>
  >({});
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const requestIdRef = useRef(0);

  useEffect(() => {
    let cancelled = false;

    getReactions()
      .then((response) => {
        if (!cancelled) {
          setReactionsByCharacterId(
            groupActiveReactionsByCharacterId(response.reactions),
          );
        }
      })
      .catch(() => {
        if (!cancelled) {
          setReactionsByCharacterId({});
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const requestCharacters = async (
    name: string,
    nextPage: number,
    { clearResults = false }: { clearResults?: boolean } = {},
  ) => {
    const requestId = ++requestIdRef.current;

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
      const response = await getCharacters({
        name,
        page: nextPage,
        limit: PAGE_SIZE,
      });
      if (requestId !== requestIdRef.current) {
        return;
      }
      setCharactersResponse(response);
      setPage(response.page);
    } catch (err) {
      if (requestId !== requestIdRef.current) {
        return;
      }
      setCharactersResponse(null);
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  };

  const handleSearch = (name: string) => {
    requestCharacters(name, 1, { clearResults: true });
  };

  const handlePageChange = (nextPage: number) => {
    if (!submittedQuery || isLoading) {
      return;
    }
    requestCharacters(submittedQuery, nextPage);
  };

  const handleRetry = () => {
    if (!submittedQuery || isLoading) {
      return;
    }
    requestCharacters(submittedQuery, page);
  };

  return (
    <Router>
      <Header onSearch={handleSearch} />
      <Routes>
        <Route
          path="/"
          element={
            <Content
              charactersResponse={charactersResponse}
              reactionsByCharacterId={reactionsByCharacterId}
              submittedQuery={submittedQuery}
              isLoading={isLoading}
              error={error}
              page={page}
              onPageChange={handlePageChange}
              onRetry={handleRetry}
            />
          }
        />
      </Routes>
    </Router>
  );
};
