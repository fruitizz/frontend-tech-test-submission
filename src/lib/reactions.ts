import { Reaction } from '../types';

/**
 * Drop deleted reactions and group the rest by character id, discarding
 * duplicate reactions (same id) for the same character. The reactions API
 * sometimes returns the same reaction more than once.
 */
export function groupActiveReactionsByCharacterId(
  reactions: Reaction[],
): Record<number, Reaction[]> {
  const byCharacterId: Record<number, Reaction[]> = {};
  const seenIdsByCharacterId: Record<number, Set<string>> = {};

  for (const reaction of reactions) {
    if (reaction.deleted) {
      continue;
    }

    const seenIds = seenIdsByCharacterId[reaction.characterId] ?? new Set<string>();
    if (seenIds.has(reaction.id)) {
      continue;
    }
    seenIds.add(reaction.id);
    seenIdsByCharacterId[reaction.characterId] = seenIds;

    const list = byCharacterId[reaction.characterId] ?? [];
    list.push(reaction);
    byCharacterId[reaction.characterId] = list;
  }

  return byCharacterId;
}
