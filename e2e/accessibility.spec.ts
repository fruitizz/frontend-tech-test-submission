import { expect, test } from '@playwright/test';

import { characterLuke } from './fixtures';
import {
  expectCharacterVisible,
  gotoApp,
  mockCharacters,
  submitSearch,
  successPageHandler,
  twoPageDataset,
} from './helpers';

test.describe('accessibility', () => {
  test('character cards are static articles without mouse-only div controls', async ({
    page,
  }) => {
    await mockCharacters(page, successPageHandler(twoPageDataset));
    await gotoApp(page);
    await submitSearch(page, 'sky');
    await expectCharacterVisible(page, characterLuke);

    const card = page.getByRole('article').filter({ hasText: characterLuke.name });
    await expect(card).toBeVisible();

    // Cards are content, not composite widgets: no button/link role on the card itself.
    await expect(card).not.toHaveAttribute('tabindex');
    await expect(card).not.toHaveRole('button');
    await expect(card).not.toHaveRole('link');

    // Meta tags are presentational spans, not keyboard targets.
    await expect(card.locator('a')).toHaveCount(0);
    await expect(card.getByRole('button')).toHaveCount(0);
    await expect(card.getByRole('link')).toHaveCount(0);
  });

  test('pagination exposes a list of real buttons', async ({ page }) => {
    await mockCharacters(page, successPageHandler(twoPageDataset));
    await gotoApp(page);
    await submitSearch(page, 'sky');

    const pagination = page.getByRole('navigation', {
      name: 'Search results pagination',
    });
    await expect(pagination.getByRole('list')).toBeVisible();
    await expect(pagination.getByRole('button', { name: 'Next page' })).toBeEnabled();
    await expect(pagination.getByRole('button', { name: 'Page 1' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });
});
