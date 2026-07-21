import { Reaction } from '../../types';

/**
 * Explicit reaction state, modeled independently at card level.
 * Search results and reaction enrichment can fail independently — a card
 * should be able to render successfully while its reactions are still
 * loading, empty, or failed, without affecting the search result state.
 */
export type ReactionState =
  | { status: 'loading' }
  | { status: 'success'; reactions: Reaction[] }
  | { status: 'empty' }
  | { status: 'error' };

export type ReactionFetchStatus = 'loading' | 'success' | 'error';

/**
 * Pure mapping from a fetch outcome + this card's reactions to an explicit
 * {@link ReactionState}. `reactions` is ignored while loading or on error.
 */
export function deriveReactionState(
  fetchStatus: ReactionFetchStatus,
  reactions: Reaction[],
): ReactionState {
  if (fetchStatus === 'loading') {
    return { status: 'loading' };
  }
  if (fetchStatus === 'error') {
    return { status: 'error' };
  }
  if (reactions.length === 0) {
    return { status: 'empty' };
  }
  return { status: 'success', reactions };
}

export const loadingReactionState: ReactionState = { status: 'loading' };
