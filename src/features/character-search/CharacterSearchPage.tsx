import React from 'react';

import { AppShell } from '../../components/AppShell';
import { CharacterCardSkeleton } from '../../components/CharacterCardSkeleton';
import { CharacterGrid } from '../../components/CharacterGrid';
import { EmptyState } from '../../components/EmptyState';
import { ErrorState } from '../../components/ErrorState';
import { SearchCommand } from '../../components/SearchCommand';
import { getErrorMessage } from '../../api';
import { useCharacterReactions } from './useCharacterReactions';
import { useCharacterSearch } from './useCharacterSearch';
import styles from './CharacterSearchPage.module.scss';

export const CharacterSearchPage: React.FC = () => {
  const { state, handleSearch, handlePageChange, handleRetry, handleClearSearch } =
    useCharacterSearch();
  const { getReactionState } = useCharacterReactions();

  const main = (
    <main className={`lumx-spacing-padding-huge ${styles.content}`}>
      {renderSearchState(state, {
        getReactionState,
        onPageChange: handlePageChange,
        onRetry: handleRetry,
      })}
    </main>
  );

  return (
    <AppShell
      searchCommand={
        <SearchCommand
          onSearch={handleSearch}
          onClearSearch={handleClearSearch}
          hasActiveSearch={state.status !== 'idle'}
        />
      }
      main={main}
    />
  );
};

interface RenderSearchStateOptions {
  getReactionState: ReturnType<typeof useCharacterReactions>['getReactionState'];
  onPageChange: (nextPage: number) => void;
  onRetry: () => void;
}

/**
 * Exhaustive switch over {@link SearchViewState}: every status renders
 * exactly one view, so there is no combination of loading/error/empty
 * flags that can contradict itself.
 */
function renderSearchState(
  state: ReturnType<typeof useCharacterSearch>['state'],
  { getReactionState, onPageChange, onRetry }: RenderSearchStateOptions,
): React.ReactNode {
  switch (state.status) {
    case 'idle':
      return <EmptyState variant="idle" />;

    case 'loading':
      if (!state.previousResults) {
        return <CharacterCardSkeleton query={state.query} />;
      }
      return (
        <CharacterGrid
          data={state.previousResults}
          getReactionState={getReactionState}
          submittedQuery={state.query}
          isPageLoading
          onPageChange={onPageChange}
        />
      );

    case 'success':
      return (
        <CharacterGrid
          data={state.data}
          getReactionState={getReactionState}
          submittedQuery={state.query}
          isPageLoading={false}
          onPageChange={onPageChange}
        />
      );

    case 'empty':
      return <EmptyState variant="empty" query={state.query} />;

    case 'error':
      return <ErrorState error={getErrorMessage(state.error)} onRetry={onRetry} />;

    default: {
      const exhaustiveCheck: never = state;
      throw new Error(`Unhandled search view state: ${JSON.stringify(exhaustiveCheck)}`);
    }
  }
}
