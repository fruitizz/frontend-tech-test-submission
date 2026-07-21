import { describe, expect, it } from 'vitest';

import { createAbortableRequest } from './abortable-request';

describe('createAbortableRequest', () => {
  it('tracks the latest request id and exposes a signal', () => {
    const controller = createAbortableRequest();
    const first = controller.next();
    const second = controller.next();

    expect(first.id).toBe(1);
    expect(second.id).toBe(2);
    expect(first.signal.aborted).toBe(true);
    expect(second.signal.aborted).toBe(false);
    expect(controller.isCurrent(first.id)).toBe(false);
    expect(controller.isCurrent(second.id)).toBe(true);
  });

  it('invalidates in-flight requests by aborting the signal', () => {
    const controller = createAbortableRequest();
    const handle = controller.next();

    controller.invalidate();

    expect(handle.signal.aborted).toBe(true);
    expect(controller.isCurrent(handle.id)).toBe(false);
  });
});
