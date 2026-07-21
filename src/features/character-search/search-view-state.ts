import { SearchError } from '../../api';
import { Character } from '../../types';

export interface SearchResultsData {
  results: Character[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Explicit view state for the character search screen.
 * Each variant carries exactly the data that is valid for that state —
 * e.g. `error` cannot also carry stale `results`, and `idle` cannot carry a query.
 */
export type SearchViewState =
  | { status: 'idle' }
  | {
      status: 'loading';
      query: string;
      page: number;
      /** Previous page's data, kept on screen while paginating. Absent on a fresh search. */
      previousResults: SearchResultsData | null;
    }
  | { status: 'success'; query: string; page: number; data: SearchResultsData }
  | { status: 'empty'; query: string; page: number }
  | { status: 'error'; query: string; page: number; error: SearchError };

interface DeriveLoadingInput {
  kind: 'loading';
  previousResults: SearchResultsData | null;
}

interface DeriveResultInput {
  kind: 'result';
  data: SearchResultsData;
}

interface DeriveErrorInput {
  kind: 'error';
  error: SearchError;
}

export type DeriveViewStateInput = {
  query: string;
  page: number;
} & (DeriveLoadingInput | DeriveResultInput | DeriveErrorInput);

/**
 * Pure mapping from a raw async outcome to an explicit {@link SearchViewState}.
 * Keeps "is this empty or a success" and "loading vs error" decisions in one
 * place instead of scattered boolean checks in components.
 */
export function deriveViewState(input: DeriveViewStateInput): SearchViewState {
  const { query, page } = input;

  switch (input.kind) {
    case 'loading':
      return { status: 'loading', query, page, previousResults: input.previousResults };
    case 'error':
      return { status: 'error', query, page, error: input.error };
    case 'result':
      if (input.data.results.length === 0) {
        return { status: 'empty', query, page };
      }
      return { status: 'success', query, page, data: input.data };
    default: {
      const exhaustiveCheck: never = input;
      throw new Error(`Unhandled derive kind: ${JSON.stringify(exhaustiveCheck)}`);
    }
  }
}

export const idleViewState: SearchViewState = { status: 'idle' };
