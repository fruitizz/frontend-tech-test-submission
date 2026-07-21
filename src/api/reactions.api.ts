import { Reaction, ReactionsResponse } from '../types';
import { requestJson } from './api-client';
import { toSearchError } from './api-errors';

/** Low-level reactions fetch (transport errors as {@link ApiError}). */
export async function getReactions(
  signal?: AbortSignal,
): Promise<ReactionsResponse> {
  return requestJson<ReactionsResponse>(
    '/api/reactions',
    signal ? { signal } : undefined,
  );
}

/**
 * Feature-facing reactions for one character.
 * Uses the bulk reactions endpoint (MSW contract) and filters client-side.
 */
export async function getCharacterReactions(
  characterId: number,
  signal?: AbortSignal,
): Promise<Reaction[]> {
  try {
    const response = await getReactions(signal);
    return response.reactions.filter(
      (reaction) =>
        !reaction.deleted && reaction.characterId === characterId,
    );
  } catch (error) {
    throw toSearchError(error);
  }
}
