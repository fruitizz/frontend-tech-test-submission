import React from 'react';

import {
  ColorPalette,
  ColorVariant,
  FlexBox,
  Progress,
  ProgressVariant,
  Size,
  Text,
  Typography,
} from '@lumx/react';

import { CharactersResponse, Reaction } from '../../types';
import { CharacterCard } from '../CharacterCard';
import { Pagination } from '../Pagination';
import styles from './CharacterGrid.module.scss';

interface CharacterGridProps {
  resultsResponse: CharactersResponse;
  reactionsByCharacterId: Record<number, Reaction[]>;
  submittedQuery: string;
  isLoading: boolean;
  onPageChange: (nextPage: number) => void;
}

export const CharacterGrid: React.FC<CharacterGridProps> = ({
  resultsResponse,
  reactionsByCharacterId,
  submittedQuery,
  isLoading,
  onPageChange,
}) => {
  const isPageLoading = isLoading;

  return (
    <section
      className={styles.results}
      aria-labelledby="search-results-summary"
      aria-busy={isPageLoading}
    >
      {isPageLoading && (
        <FlexBox
          className={styles.pageLoading}
          orientation="horizontal"
          vAlign="center"
          hAlign="center"
          gap={Size.tiny}
          role="status"
          aria-live="polite"
        >
          <Progress variant={ProgressVariant.circular} />
          <Text
            as="p"
            typography={Typography.body2}
            color={ColorPalette.dark}
            colorVariant={ColorVariant.L1}
          >
            Loading…
          </Text>
        </FlexBox>
      )}

      <Text
        as="p"
        id="search-results-summary"
        typography={Typography.body2}
        color={ColorPalette.dark}
        colorVariant={ColorVariant.L1}
        className={styles.summary}
      >
        Results for “{submittedQuery}” (page {resultsResponse.page}, total{' '}
        {resultsResponse.total})
      </Text>
      <ul className={styles.resultList}>
        {resultsResponse.results.map((character) => (
          <li key={character.id} className={styles.resultItem}>
            <CharacterCard
              character={character}
              reactions={reactionsByCharacterId[character.id] ?? []}
            />
          </li>
        ))}
      </ul>
      <Pagination
        page={resultsResponse.page}
        total={resultsResponse.total}
        limit={resultsResponse.limit}
        isLoading={isLoading}
        onPageChange={onPageChange}
      />
    </section>
  );
};
