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

  it('drops duplicate reactions with the same id for a character', () => {
    // Reproduces the Mace Windu case: the reactions API returns the same
    // reaction id three times for the same character.
    const duplicated: Reaction[] = [
      { id: '401', content: '😈', characterId: 4, deleted: false },
      { id: '401', content: '😈', characterId: 4, deleted: false },
      { id: '401', content: '😈', characterId: 4, deleted: false },
      { id: '404', content: '😈', characterId: 4, deleted: false },
    ];

    expect(groupActiveReactionsByCharacterId(duplicated)).toEqual({
      4: [
        { id: '401', content: '😈', characterId: 4, deleted: false },
        { id: '404', content: '😈', characterId: 4, deleted: false },
      ],
    });
  });

  it('keeps the same id when it belongs to different characters', () => {
    const reactions: Reaction[] = [
      { id: 'shared', content: '⭐', characterId: 1, deleted: false },
      { id: 'shared', content: '⭐', characterId: 2, deleted: false },
    ];

    expect(groupActiveReactionsByCharacterId(reactions)).toEqual({
      1: [{ id: 'shared', content: '⭐', characterId: 1, deleted: false }],
      2: [{ id: 'shared', content: '⭐', characterId: 2, deleted: false }],
    });
  });
});
