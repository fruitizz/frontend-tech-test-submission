import React from 'react';

import { CharacterResult } from '../CharacterResult';
import { CharactersResponse } from '../../types';
import styles from './Content.module.scss';

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
        <div className={styles.results}>
          <p className={styles.summary}>
            Results for “{submittedQuery}” (page {page}, total {charactersResponse.total})
          </p>
          {charactersResponse.results.map((character) => (
            <CharacterResult key={character.id} character={character} />
          ))}
        </div>
      )}
    </section>
  );
};
