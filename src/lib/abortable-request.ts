export interface AbortableRequest {
  next: () => number;
  invalidate: () => void;
  isCurrent: (requestId: number) => boolean;
}

/** Request-id helper to ignore stale in-flight responses. */
export function createAbortableRequest(): AbortableRequest {
  let requestId = 0;

  return {
    next: () => {
      requestId += 1;
      return requestId;
    },
    invalidate: () => {
      requestId += 1;
    },
    isCurrent: (id) => id === requestId,
  };
}
