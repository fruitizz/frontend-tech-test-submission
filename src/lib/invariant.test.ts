import { describe, expect, it } from 'vitest';

import { invariant } from './invariant';

describe('invariant', () => {
  it('does nothing when the condition is truthy', () => {
    expect(() => invariant(true, 'failed')).not.toThrow();
  });

  it('throws when the condition is falsy', () => {
    expect(() => invariant(false, 'failed')).toThrow('failed');
  });
});
