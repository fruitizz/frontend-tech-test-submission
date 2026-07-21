export type ApiErrorKind = 'http' | 'network' | 'parse' | 'aborted';

/**
 * Application-facing API failure at the transport boundary.
 * UI features should prefer {@link SearchError} / {@link toSearchError}.
 */
export class ApiError extends Error {
  readonly cause?: unknown;

  constructor(
    message: string,
    public readonly kind: ApiErrorKind,
    public readonly status?: number,
    options?: { cause?: unknown },
  ) {
    super(message);
    this.name = 'ApiError';
    this.cause = options?.cause;
  }
}

export type SearchErrorCode =
  | 'network_error'
  | 'invalid_response'
  | 'request_aborted'
  | 'unknown_error';

/**
 * Feature-facing search/API failure. Keeps transport details out of UI.
 */
export class SearchError extends Error {
  readonly cause?: unknown;

  constructor(
    message: string,
    public readonly code: SearchErrorCode,
    options?: { cause?: unknown },
  ) {
    super(message);
    this.name = 'SearchError';
    this.cause = options?.cause;
  }
}

export function isAbortError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.kind === 'aborted';
  }
  if (error instanceof DOMException) {
    return error.name === 'AbortError';
  }
  return error instanceof Error && error.name === 'AbortError';
}

/** Map any thrown value into a stable {@link SearchError}. */
export function toSearchError(error: unknown): SearchError {
  if (error instanceof SearchError) {
    return error;
  }

  if (error instanceof ApiError) {
    switch (error.kind) {
      case 'network':
        return new SearchError(error.message, 'network_error', { cause: error });
      case 'parse':
        return new SearchError(error.message, 'invalid_response', {
          cause: error,
        });
      case 'aborted':
        return new SearchError(error.message, 'request_aborted', {
          cause: error,
        });
      case 'http':
      default:
        return new SearchError(error.message, 'unknown_error', { cause: error });
    }
  }

  if (isAbortError(error)) {
    return new SearchError('Request aborted', 'request_aborted', {
      cause: error,
    });
  }

  return new SearchError('Request failed', 'unknown_error', { cause: error });
}

/** Stable user-facing message; aborted requests intentionally yield no copy. */
export function getErrorMessage(error: unknown): string {
  const searchError = toSearchError(error);
  if (searchError.code === 'request_aborted') {
    return '';
  }
  return searchError.message;
}
