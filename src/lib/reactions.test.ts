import { describe, expect, it } from 'vitest';

import type { Reaction } from '../types';
import { groupActiveReactionsByCharacterId } from './reactions';

describe('groupActiveReactionsByCharacterId', () => {
  const reactions: Reaction[] = [
    { id: 'a', content: '👍', characterId: 1, deleted: false },
    { id: 'b', content: '👎', characterId: 1, deleted: true },
    { id: 'c', content: '❤️', characterId: 2, deleted: false },
  ];

  it('groups active reactions by character id', () => {
    expect(groupActiveReactionsByCharacterId(reactions)).toEqual({
      1: [{ id: 'a', content: '👍', characterId: 1, deleted: false }],
      2: [{ id: 'c', content: '❤️', characterId: 2, deleted: false }],
    });
  });

  it('returns an empty object when every reaction is deleted', () => {
    expect(
      groupActiveReactionsByCharacterId([
        { id: 'x', content: '👻', characterId: 9, deleted: true },
      ]),
    ).toEqual({});
  });
});
