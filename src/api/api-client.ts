import { ApiError, isAbortError } from './api-errors';

export async function requestJson<T>(
  url: string,
  init?: RequestInit,
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(url, init);
  } catch (cause) {
    if (isAbortError(cause) || init?.signal?.aborted) {
      throw new ApiError('Request aborted', 'aborted', undefined, { cause });
    }
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
