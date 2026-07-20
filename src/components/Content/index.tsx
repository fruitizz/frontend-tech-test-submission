import React from 'react';

import { CharacterResult } from '../CharacterResult';
import { Pagination } from '../Pagination';
import { CharactersResponse, Reaction } from '../../types';
import styles from './Content.module.scss';

interface ContentProps {
  charactersResponse: CharactersResponse | null;
  reactionsByCharacterId: Record<number, Reaction[]>;
  submittedQuery: string;
  isLoading: boolean;
  error: string | null;
  page: number;
  onPageChange: (nextPage: number) => void;
}

export const Content: React.FC<ContentProps> = ({
  charactersResponse,
  reactionsByCharacterId,
  submittedQuery,
  isLoading,
  error,
  page,
  onPageChange,
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
            <CharacterResult
              key={character.id}
              character={character}
              reactions={reactionsByCharacterId[character.id] ?? []}
            />
          ))}
          <Pagination
            hasPrevious={charactersResponse.previous !== null}
            hasNext={charactersResponse.next !== null}
            isLoading={isLoading}
            onPrevious={() => onPageChange(page - 1)}
            onNext={() => onPageChange(page + 1)}
          />
        </div>
      )}
    </section>
  );
};
