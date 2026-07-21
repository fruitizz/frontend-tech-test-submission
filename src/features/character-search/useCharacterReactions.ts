import { useEffect, useState } from 'react';

import { ApiError, getReactions, isAbortError } from '../../api';
import { groupActiveReactionsByCharacterId } from '../../lib/reactions';
import { Reaction } from '../../types';

export function useCharacterReactions() {
  const [reactionsByCharacterId, setReactionsByCharacterId] = useState<
    Record<number, Reaction[]>
  >({});

  useEffect(() => {
    const controller = new AbortController();

    getReactions(controller.signal)
      .then((response) => {
        setReactionsByCharacterId(
          groupActiveReactionsByCharacterId(response.reactions),
        );
      })
      .catch((error: unknown) => {
        if (isAbortError(error) || controller.signal.aborted) {
          return;
        }
        if (error instanceof ApiError && error.kind === 'aborted') {
          return;
        }
        setReactionsByCharacterId({});
      });

    return () => {
      controller.abort();
    };
  }, []);

  return { reactionsByCharacterId };
}
