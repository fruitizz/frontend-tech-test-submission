import { Character, CharactersResponse, GetCharactersParams } from '../types';
import { requestJson } from './api-client';
import { toSearchError } from './api-errors';

export interface SearchCharactersInput {
  query: string;
  page: number;
  pageSize: 4;
  signal?: AbortSignal;
}

export interface SearchCharactersResult {
  items: Character[];
  total: number;
  page: number;
  pageSize: number;
}

/** Low-level characters fetch (transport errors as {@link ApiError}). */
export async function getCharacters(
  { name, page, limit }: GetCharactersParams,
  signal?: AbortSignal,
): Promise<CharactersResponse> {
  const params = new URLSearchParams({
    name,
    page: String(page),
    limit: String(limit),
  });

  return requestJson<CharactersResponse>(
    `/api/characters?${params.toString()}`,
    signal ? { signal } : undefined,
  );
}

/**
 * Feature-facing character search. Normalizes failures to {@link SearchError}.
 */
export async function searchCharacters(
  input: SearchCharactersInput,
): Promise<SearchCharactersResult> {
  try {
    const response = await getCharacters(
      {
        name: input.query,
        page: input.page,
        limit: input.pageSize,
      },
      input.signal,
    );

    return {
      items: response.results,
      total: response.total,
      page: response.page,
      pageSize: response.limit,
    };
  } catch (error) {
    throw toSearchError(error);
  }
}
