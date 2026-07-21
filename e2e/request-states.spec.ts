import { expect, test } from '@playwright/test';

import { characterLuke, emptyCharactersResponse } from './fixtures';
import {
  clearButton,
  expectCharacterVisible,
  expectIdleState,
  fulfillJson,
  gotoApp,
  mockCharacters,
  nextPageButton,
  parseCharactersUrl,
  retryButton,
  searchInput,
  submitSearch,
  successPageHandler,
  twoPageDataset,
} from './helpers';

test.describe('request states', () => {
  test('shows error state and retries the same query', async ({ page }) => {
    let shouldFail = true;
    const requests: string[] = [];

    await mockCharacters(page, async (route) => {
      requests.push(route.request().url());
      if (shouldFail) {
        await fulfillJson(route, { message: 'boom' }, 500);
        return;
      }
      await successPageHandler(twoPageDataset)(route);
    });

    await gotoApp(page);
    await submitSearch(page, 'sky');

    await expect(page.getByText('Something went wrong')).toBeVisible();
    await expect(retryButton(page)).toBeVisible();
    await expect(searchInput(page)).toBeEnabled();

    shouldFail = false;
    await retryButton(page).click();

    await expectCharacterVisible(page, characterLuke);
    await expect(page.getByText('Something went wrong')).toHaveCount(0);

    const first = parseCharactersUrl(requests[0]);
    const retry = parseCharactersUrl(requests[requests.length - 1]);
    expect(first).toEqual({ name: 'sky', page: '1', limit: '4' });
    expect(retry).toEqual(first);
  });

  test('retries a failed page-2 request for page 2', async ({ page }) => {
    let failPage2 = true;
    const requests: string[] = [];

    await mockCharacters(page, async (route) => {
      const url = route.request().url();
      requests.push(url);
      const { page: pageParam } = parseCharactersUrl(url);

      if (pageParam === '2' && failPage2) {
        await fulfillJson(route, { message: 'boom' }, 500);
        return;
      }

      await successPageHandler(twoPageDataset)(route);
    });

    await gotoApp(page);
    await submitSearch(page, 'sky');
    await expectCharacterVisible(page, characterLuke);
    await nextPageButton(page).click();

    await expect(page.getByText('Something went wrong')).toBeVisible();
    failPage2 = false;
    await retryButton(page).click();

    await expectCharacterVisible(page, twoPageDataset[2].results[0]);
    const retry = parseCharactersUrl(requests[requests.length - 1]);
    expect(retry.page).toBe('2');
    expect(retry.name).toBe('sky');
  });

  test('clear during an in-flight request ignores late results', async ({ page }) => {
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });

    await mockCharacters(page, async (route) => {
      await gate;
      await successPageHandler(twoPageDataset)(route);
    });

    await gotoApp(page);
    await submitSearch(page, 'sky');
    await expect(page.getByText(/Searching for/)).toBeVisible();

    await clearButton(page).click();
    await expectIdleState(page);

    release();
    await page.waitForTimeout(100);
    await expect(page.getByRole('heading', { name: characterLuke.name })).toHaveCount(0);
    await expectIdleState(page);
  });

  test('empty response does not show error', async ({ page }) => {
    await mockCharacters(page, async (route) => {
      await fulfillJson(route, emptyCharactersResponse);
    });
    await gotoApp(page);
    await submitSearch(page, 'nobody');

    await expect(page.getByText('No results matched your search.')).toBeVisible();
    await expect(page.getByText('Something went wrong')).toHaveCount(0);
  });
});
