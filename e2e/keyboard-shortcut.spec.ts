import { expect, test } from '@playwright/test';

import {
  fulfillJson,
  gotoApp,
  mockCharacters,
  searchInput,
  successPageHandler,
  twoPageDataset,
} from './helpers';
import { emptyCharactersResponse } from './fixtures';

test.describe('keyboard shortcut', () => {
  test.beforeEach(async ({ page }) => {
    await mockCharacters(page, async (route) => {
      await fulfillJson(route, emptyCharactersResponse);
    });
    await gotoApp(page);
  });

  test('Meta+K focuses the existing search input without searching', async ({ page }) => {
    const requests: string[] = [];
    await page.unroute('**/api/characters**');
    await mockCharacters(page, async (route) => {
      requests.push(route.request().url());
      await successPageHandler(twoPageDataset)(route);
    });

    await searchInput(page).fill('preserved');
    await page.getByAltText('My Static App Logo').click();
    await expect(searchInput(page)).not.toBeFocused();

    await page.keyboard.press('Meta+K');

    await expect(searchInput(page)).toBeFocused();
    await expect(searchInput(page)).toHaveValue('preserved');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    expect(requests).toHaveLength(0);
  });

  test('Control+K focuses the existing search input without searching', async ({ page }) => {
    const requests: string[] = [];
    await page.unroute('**/api/characters**');
    await mockCharacters(page, async (route) => {
      requests.push(route.request().url());
      await successPageHandler(twoPageDataset)(route);
    });

    await searchInput(page).fill('ctrl preserved');
    await page.getByAltText('My Static App Logo').click();

    await page.keyboard.press('Control+K');

    await expect(searchInput(page)).toBeFocused();
    await expect(searchInput(page)).toHaveValue('ctrl preserved');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    expect(requests).toHaveLength(0);
  });

  test('repeated shortcut keydown does not submit a search', async ({ page }) => {
    const requests: string[] = [];
    await page.unroute('**/api/characters**');
    await mockCharacters(page, async (route) => {
      requests.push(route.request().url());
      await successPageHandler(twoPageDataset)(route);
    });

    await searchInput(page).fill('repeat');
    await page.getByAltText('My Static App Logo').click();

    await page.keyboard.down('Meta');
    await page.keyboard.down('k');
    await page.keyboard.press('k');
    await page.keyboard.up('k');
    await page.keyboard.up('Meta');

    await expect(searchInput(page)).toBeFocused();
    await expect(searchInput(page)).toHaveValue('repeat');
    expect(requests).toHaveLength(0);
  });
});
