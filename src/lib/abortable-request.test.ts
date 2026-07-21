import { describe, expect, it } from 'vitest';

import { createAbortableRequest } from './abortable-request';

describe('createAbortableRequest', () => {
  it('tracks the latest request id', () => {
    const controller = createAbortableRequest();
    const first = controller.next();
    const second = controller.next();

    expect(first).toBe(1);
    expect(second).toBe(2);
    expect(controller.isCurrent(first)).toBe(false);
    expect(controller.isCurrent(second)).toBe(true);
  });

  it('invalidates in-flight requests', () => {
    const controller = createAbortableRequest();
    const requestId = controller.next();

    controller.invalidate();

    expect(controller.isCurrent(requestId)).toBe(false);
  });
});
