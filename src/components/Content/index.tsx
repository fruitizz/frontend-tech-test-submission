import React from 'react';

import { mdiAlertCircleOutline, mdiMagnify } from '@lumx/icons';
import {
  Button,
  ColorPalette,
  ColorVariant,
  Emphasis,
  FlexBox,
  Icon,
  Progress,
  ProgressVariant,
  Size,
  Text,
  Typography,
} from '@lumx/react';

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
  onPageChange: (nextPage: number) => void;
  onRetry: () => void;
}

export const Content: React.FC<ContentProps> = ({
  charactersResponse,
  reactionsByCharacterId,
  submittedQuery,
  isLoading,
  error,
  onPageChange,
  onRetry,
}) => {
  const hasResults =
    charactersResponse !== null && charactersResponse.results.length > 0;
  const isEmptyResponse =
    charactersResponse !== null && charactersResponse.results.length === 0;
  const isInitialLoading = isLoading && !hasResults;
  const isPageLoading = isLoading && hasResults;
  const resultsResponse = hasResults ? charactersResponse : null;

  return (
    <section className={`lumx-spacing-padding-huge ${styles.content}`}>
      {!submittedQuery && (
        <Text
          as="p"
          typography={Typography.body1}
          color={ColorPalette.dark}
          colorVariant={ColorVariant.L2}
          className={styles.idleHint}
        >
          Search for a character to get started.
        </Text>
      )}

      {submittedQuery && error && !isLoading && (
        <FlexBox
          className={styles.state}
          orientation="vertical"
          vAlign="center"
          hAlign="center"
          gap={Size.regular}
          role="alert"
        >
          <Icon
            icon={mdiAlertCircleOutline}
            size={Size.l}
            color={ColorPalette.dark}
            colorVariant={ColorVariant.L2}
          />
          <Text
            as="p"
            typography={Typography.subtitle2}
            color={ColorPalette.dark}
            colorVariant={ColorVariant.N}
            className={styles.stateTitle}
          >
            Something went wrong
          </Text>
          <Text
            as="p"
            typography={Typography.body1}
            color={ColorPalette.dark}
            colorVariant={ColorVariant.L1}
            className={styles.stateMessage}
          >
            {error}
          </Text>
          <Button emphasis={Emphasis.high} onClick={onRetry}>
            Retry
          </Button>
        </FlexBox>
      )}

      {submittedQuery && isInitialLoading && (
        <FlexBox
          className={styles.state}
          orientation="vertical"
          vAlign="center"
          hAlign="center"
          gap={Size.regular}
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <Progress variant={ProgressVariant.circular} />
          <Text
            as="p"
            typography={Typography.body1}
            color={ColorPalette.dark}
            colorVariant={ColorVariant.N}
          >
            Searching for “{submittedQuery}”…
          </Text>
        </FlexBox>
      )}

      {submittedQuery && !isLoading && !error && isEmptyResponse && (
        <FlexBox
          className={styles.state}
          orientation="vertical"
          vAlign="center"
          hAlign="center"
          gap={Size.regular}
          role="status"
          aria-live="polite"
        >
          <Icon
            icon={mdiMagnify}
            size={Size.l}
            color={ColorPalette.dark}
            colorVariant={ColorVariant.L2}
          />
          <Text
            as="p"
            typography={Typography.subtitle2}
            color={ColorPalette.dark}
            colorVariant={ColorVariant.N}
            className={styles.stateTitle}
          >
            No results found
          </Text>
          <Text
            as="p"
            typography={Typography.body1}
            color={ColorPalette.dark}
            colorVariant={ColorVariant.L1}
            className={styles.stateMessage}
          >
            No characters matched “{submittedQuery}”. Try a different search.
          </Text>
        </FlexBox>
      )}

      {resultsResponse && (
        <div
          className={styles.results}
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
            typography={Typography.body2}
            color={ColorPalette.dark}
            colorVariant={ColorVariant.L1}
            className={styles.summary}
          >
            Results for “{submittedQuery}” (page {resultsResponse.page}, total{' '}
            {resultsResponse.total})
          </Text>
          {resultsResponse.results.map((character) => (
            <CharacterResult
              key={character.id}
              character={character}
              reactions={reactionsByCharacterId[character.id] ?? []}
            />
          ))}
          <Pagination
            page={resultsResponse.page}
            total={resultsResponse.total}
            limit={resultsResponse.limit}
            isLoading={isLoading}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </section>
  );
};
