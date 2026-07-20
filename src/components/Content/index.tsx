import React from 'react';

import { CharactersResponse } from '../../types';

interface ContentProps {
  charactersResponse: CharactersResponse | null;
  submittedQuery: string;
  isLoading: boolean;
  error: string | null;
  page: number;
}

export const Content: React.FC<ContentProps> = ({
  charactersResponse,
  submittedQuery,
  isLoading,
  error,
  page,
}) => {
  return (
    <section className="lumx-spacing-padding-huge">
      {isLoading && <p>Loading…</p>}
      {error && <p role="alert">{error}</p>}
      {!isLoading && !error && charactersResponse && (
        <div>
          <p>
            Results for “{submittedQuery}” (page {page}, total {charactersResponse.total})
          </p>
          <ul>
            {charactersResponse.results.map((character) => (
              <li key={character.id}>{character.name}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};
