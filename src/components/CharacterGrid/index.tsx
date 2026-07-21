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

import { ReactionState } from '../../features/character-search/reaction-state';
import { SearchResultsData } from '../../features/character-search/search-view-state';
import { CharacterCard } from '../CharacterCard';
import { Pagination } from '../Pagination';
import styles from './CharacterGrid.module.scss';

interface CharacterGridProps {
  data: SearchResultsData;
  getReactionState: (characterId: number) => ReactionState;
  submittedQuery: string;
  isPageLoading: boolean;
  onPageChange: (nextPage: number) => void;
}

export const CharacterGrid: React.FC<CharacterGridProps> = ({
  data,
  getReactionState,
  submittedQuery,
  isPageLoading,
  onPageChange,
}) => {
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
        Results for “{submittedQuery}” (page {data.page}, total{' '}
        {data.total})
      </Text>
      <ul className={styles.resultList}>
        {data.results.map((character) => (
          <li key={character.id} className={styles.resultItem}>
            <CharacterCard
              character={character}
              reactionState={getReactionState(character.id)}
            />
          </li>
        ))}
      </ul>
      <Pagination
        page={data.page}
        total={data.total}
        limit={data.pageSize}
        isLoading={isPageLoading}
        onPageChange={onPageChange}
      />
    </section>
  );
};
