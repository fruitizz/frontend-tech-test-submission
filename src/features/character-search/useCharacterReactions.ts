import { useCallback, useEffect, useState } from 'react';

import { getReactions, toSearchError } from '../../api';
import { groupActiveReactionsByCharacterId } from '../../lib/reactions';
import { Reaction } from '../../types';
import { ReactionFetchStatus, ReactionState, deriveReactionState } from './reaction-state';

export function useCharacterReactions() {
  const [fetchStatus, setFetchStatus] = useState<ReactionFetchStatus>('loading');
  const [reactionsByCharacterId, setReactionsByCharacterId] = useState<
    Record<number, Reaction[]>
  >({});

  useEffect(() => {
    const controller = new AbortController();
    setFetchStatus('loading');

    getReactions(controller.signal)
      .then((response) => {
        setReactionsByCharacterId(
          groupActiveReactionsByCharacterId(response.reactions),
        );
        setFetchStatus('success');
      })
      .catch((error: unknown) => {
        const searchError = toSearchError(error);
        if (searchError.code === 'request_aborted') {
          return;
        }
        // Reaction enrichment failing is independent of the search itself:
        // cards still render, they just report their own reaction failure.
        setReactionsByCharacterId({});
        setFetchStatus('error');
      });

    return () => {
      controller.abort();
    };
  }, []);

  const getReactionState = useCallback(
    (characterId: number): ReactionState =>
      deriveReactionState(fetchStatus, reactionsByCharacterId[characterId] ?? []),
    [fetchStatus, reactionsByCharacterId],
  );

  return { getReactionState };
}
