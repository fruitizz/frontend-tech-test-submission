import {
  CharactersResponse,
  GetCharactersParams,
  ReactionsResponse,
} from '../types';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const detail = response.statusText
      ? `${response.status} ${response.statusText}`
      : String(response.status);
    throw new ApiError(`API request failed: ${detail}`, response.status);
  }

  return response.json() as Promise<T>;
}

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

  const response = await fetch(`/api/characters?${params.toString()}`);
  return parseJsonResponse<CharactersResponse>(response);
}

export async function getReactions(): Promise<ReactionsResponse> {
  const response = await fetch('/api/reactions');
  return parseJsonResponse<ReactionsResponse>(response);
}
