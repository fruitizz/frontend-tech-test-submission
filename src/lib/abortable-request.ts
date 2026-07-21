export interface AbortableRequestHandle {
  id: number;
  signal: AbortSignal;
}

export interface AbortableRequest {
  next: () => AbortableRequestHandle;
  invalidate: () => void;
  isCurrent: (requestId: number) => boolean;
}

/**
 * Coordinates in-flight work with AbortSignal + generation ids.
 * `invalidate` / a newer `next` aborts the previous signal.
 */
export function createAbortableRequest(): AbortableRequest {
  let requestId = 0;
  let controller = new AbortController();

  return {
    next: () => {
      controller.abort();
      controller = new AbortController();
      requestId += 1;
      return { id: requestId, signal: controller.signal };
    },
    invalidate: () => {
      controller.abort();
      controller = new AbortController();
      requestId += 1;
    },
    isCurrent: (id) => id === requestId,
  };
}
