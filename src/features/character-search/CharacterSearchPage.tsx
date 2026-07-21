import React from 'react';

import { AppShell } from '../../components/AppShell';
import { CharacterCardSkeleton } from '../../components/CharacterCardSkeleton';
import { CharacterGrid } from '../../components/CharacterGrid';
import { EmptyState } from '../../components/EmptyState';
import { ErrorState } from '../../components/ErrorState';
import { SearchCommand } from '../../components/SearchCommand';
import { useCharacterReactions } from './useCharacterReactions';
import { useCharacterSearch } from './useCharacterSearch';
import styles from './CharacterSearchPage.module.scss';

export const CharacterSearchPage: React.FC = () => {
  const {
    submittedQuery,
    isLoading,
    error,
    isEmptyResponse,
    isInitialLoading,
    resultsResponse,
    handleSearch,
    handlePageChange,
    handleRetry,
    handleClearSearch,
  } = useCharacterSearch();
  const { reactionsByCharacterId } = useCharacterReactions();

  const main = (
    <main className={`lumx-spacing-padding-huge ${styles.content}`}>
      {!submittedQuery && <EmptyState variant="idle" />}

      {submittedQuery && error && !isLoading && (
        <ErrorState error={error} onRetry={handleRetry} />
      )}

      {submittedQuery && isInitialLoading && (
        <CharacterCardSkeleton query={submittedQuery} />
      )}

      {submittedQuery && !isLoading && !error && isEmptyResponse && (
        <EmptyState variant="empty" query={submittedQuery} />
      )}

      {resultsResponse && (
        <CharacterGrid
          resultsResponse={resultsResponse}
          reactionsByCharacterId={reactionsByCharacterId}
          submittedQuery={submittedQuery}
          isLoading={isLoading}
          onPageChange={handlePageChange}
        />
      )}
    </main>
  );

  return (
    <AppShell
      searchCommand={
        <SearchCommand
          onSearch={handleSearch}
          onClearSearch={handleClearSearch}
          hasActiveSearch={Boolean(submittedQuery)}
        />
      }
      main={main}
    />
  );
};
