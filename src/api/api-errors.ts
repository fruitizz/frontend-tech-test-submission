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
