import { CharactersResponse, GetCharactersParams } from '../types';
import { requestJson } from './api-client';

export async function getCharacters({
  name,
  page,
  limit,
}: GetCharactersParams): Promise<CharactersResponse> {
  const params = new URLSearchParams({
    name,
    page: String(page),
    limit: String(limit),
  });

  return requestJson<CharactersResponse>(
    `/api/characters?${params.toString()}`,
  );
}
