import { Reaction } from '../types';

/** Drop deleted reactions and group the rest by character id. */
export function groupActiveReactionsByCharacterId(
  reactions: Reaction[],
): Record<number, Reaction[]> {
  const byCharacterId: Record<number, Reaction[]> = {};

  for (const reaction of reactions) {
    if (reaction.deleted) {
      continue;
    }

    const list = byCharacterId[reaction.characterId] ?? [];
    list.push(reaction);
    byCharacterId[reaction.characterId] = list;
  }

  return byCharacterId;
}
