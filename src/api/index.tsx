import {
  CharactersResponse,
  GetCharactersParams,
  ReactionsResponse,
} from '../types';

export type ApiErrorKind = 'http' | 'network' | 'parse';

/**
 * Application-facing API failure. UI should depend on this type only —
 * never on raw `fetch` / browser transport errors.
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly kind: ApiErrorKind,
    public readonly status?: number,
    options?: { cause?: unknown },
  ) {
    super(message, options);
    this.name = 'ApiError';
  }
}

/** Stable user-facing message from any thrown value at the API boundary. */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  return 'Request failed';
}

async function requestJson<T>(url: string): Promise<T> {
  let response: Response;

  try {
    response = await fetch(url);
  } catch (cause) {
    throw new ApiError('Network request failed', 'network', undefined, {
      cause,
    });
  }

  if (!response.ok) {
    const detail = response.statusText
      ? `${response.status} ${response.statusText}`
      : String(response.status);
    throw new ApiError(`API request failed: ${detail}`, 'http', response.status);
  }

  try {
    return (await response.json()) as T;
  } catch (cause) {
    throw new ApiError('Invalid API response', 'parse', response.status, {
      cause,
    });
  }
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

  return requestJson<CharactersResponse>(
    `/api/characters?${params.toString()}`,
  );
}

export async function getReactions(): Promise<ReactionsResponse> {
  return requestJson<ReactionsResponse>('/api/reactions');
}
