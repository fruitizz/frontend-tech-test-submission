import React, { useRef, useState } from 'react';

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

import { Header } from '../Header';
import { Content } from '../Content';
import { getCharacters } from '../../api';
import { CharactersResponse } from '../../types';

const PAGE_SIZE = 4;

export const App: React.FC = () => {
  const [charactersResponse, setCharactersResponse] = useState<CharactersResponse | null>(null);
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const requestIdRef = useRef(0);

  const handleSearch = async (name: string) => {
    const requestId = ++requestIdRef.current;

    setSubmittedQuery(name);
    setPage(1);
    setIsLoading(true);
    setError(null);

    try {
      const response = await getCharacters({ name, page: 1, limit: PAGE_SIZE });
      if (requestId !== requestIdRef.current) {
        return;
      }
      setCharactersResponse(response);
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

  return (
    <Router>
      <Header onSearch={handleSearch} />
      <Routes>
        <Route
          path="/"
          element={
            <Content
              charactersResponse={charactersResponse}
              submittedQuery={submittedQuery}
              isLoading={isLoading}
              error={error}
              page={page}
            />
          }
        />
      </Routes>
    </Router>
  );
};
