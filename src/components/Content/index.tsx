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

interface ContentStatusProps {
  icon: string;
  title: string;
  description?: string;
  role?: React.AriaRole;
  'aria-live'?: 'off' | 'polite' | 'assertive';
  children?: React.ReactNode;
}

const ContentStatus: React.FC<ContentStatusProps> = ({
  icon,
  title,
  description,
  role = 'status',
  'aria-live': ariaLive,
  children,
}) => (
  <FlexBox
    className={styles.state}
    orientation="vertical"
    vAlign="center"
    hAlign="center"
    gap={Size.regular}
    role={role}
    aria-live={ariaLive}
  >
    <Icon
      icon={icon}
      size={Size.l}
      color={ColorPalette.dark}
      colorVariant={ColorVariant.L2}
    />
    <Text
      as="h2"
      typography={Typography.custom.title3}
      color={ColorPalette.dark}
      colorVariant={ColorVariant.N}
      className={styles.stateTitle}
    >
      {title}
    </Text>
    {description ? (
      <Text
        as="p"
        typography={Typography.body1}
        color={ColorPalette.dark}
        colorVariant={ColorVariant.L1}
        className={styles.stateMessage}
      >
        {description}
      </Text>
    ) : null}
    {children}
  </FlexBox>
);

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
    <main className={`lumx-spacing-padding-huge ${styles.content}`}>
      {!submittedQuery && (
        <ContentStatus
          icon={mdiMagnify}
          title="Search for a character to get started."
          aria-live="polite"
        />
      )}

      {submittedQuery && error && !isLoading && (
        <ContentStatus
          icon={mdiAlertCircleOutline}
          title="Something went wrong"
          description={error}
          role="alert"
        >
          <Button emphasis={Emphasis.high} type="button" onClick={onRetry}>
            Retry
          </Button>
        </ContentStatus>
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
        <ContentStatus
          icon={mdiMagnify}
          title="No results matched your search."
          description={`No characters matched “${submittedQuery}”. Try a different search.`}
          aria-live="polite"
        />
      )}

      {resultsResponse && (
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
                <CharacterResult
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
      )}
    </main>
  );
};
