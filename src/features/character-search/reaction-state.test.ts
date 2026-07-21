import { describe, expect, it } from 'vitest';

import type { Reaction } from '../../types';
import { deriveReactionState, loadingReactionState } from './reaction-state';

const reactions: Reaction[] = [
  { id: 'a', content: '⭐', characterId: 1, deleted: false },
];

describe('loadingReactionState', () => {
  it('is a plain loading status', () => {
    expect(loadingReactionState).toEqual({ status: 'loading' });
  });
});

describe('deriveReactionState', () => {
  it('reports loading regardless of reaction data', () => {
    expect(deriveReactionState('loading', reactions)).toEqual({
      status: 'loading',
    });
    expect(deriveReactionState('loading', [])).toEqual({ status: 'loading' });
  });

  it('reports error independently of a successful search', () => {
    expect(deriveReactionState('error', reactions)).toEqual({
      status: 'error',
    });
  });

  it('reports success with reactions for this character', () => {
    expect(deriveReactionState('success', reactions)).toEqual({
      status: 'success',
      reactions,
    });
  });

  it('reports empty when the fetch succeeded with no matching reactions', () => {
    expect(deriveReactionState('success', [])).toEqual({ status: 'empty' });
  });
});
