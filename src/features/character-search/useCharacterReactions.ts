import { useEffect, useState } from 'react';

import { getReactions } from '../../api';
import { groupActiveReactionsByCharacterId } from '../../lib/reactions';
import { Reaction } from '../../types';

export function useCharacterReactions() {
  const [reactionsByCharacterId, setReactionsByCharacterId] = useState<
    Record<number, Reaction[]>
  >({});

  useEffect(() => {
    let cancelled = false;

    getReactions()
      .then((response) => {
        if (!cancelled) {
          setReactionsByCharacterId(
            groupActiveReactionsByCharacterId(response.reactions),
          );
        }
      })
      .catch(() => {
        if (!cancelled) {
          setReactionsByCharacterId({});
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { reactionsByCharacterId };
}
