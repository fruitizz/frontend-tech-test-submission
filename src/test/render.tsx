/**
 * Minimal render helper for future component tests.
 * Vitest runs in node; use jsdom or document stubs when adding UI tests.
 */
export function createTestContainer(): HTMLDivElement {
  const container = document.createElement('div');
  document.body.appendChild(container);
  return container;
}
