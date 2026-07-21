import { expect, test } from '@playwright/test';

import { characterLuke } from './fixtures';
import {
  expectCharacterVisible,
  fulfillJson,
  gotoApp,
  mockCharacters,
  nextPageButton,
  parseCharactersUrl,
  previousPageButton,
  submitSearch,
  successPageHandler,
  twoPageDataset,
} from './helpers';

test.describe('pagination', () => {
  test('navigates between pages without appending results', async ({ page }) => {
    const requests: string[] = [];

    await mockCharacters(page, async (route) => {
      requests.push(route.request().url());
      await successPageHandler(twoPageDataset)(route);
    });
    await gotoApp(page);
    await submitSearch(page, 'sky');

    await expectCharacterVisible(page, characterLuke);
    await expect(previousPageButton(page)).toBeDisabled();
    await expect(nextPageButton(page)).toBeEnabled();

    await nextPageButton(page).click();
    await expectCharacterVisible(page, twoPageDataset[2].results[0]);
    await expect(page.getByRole('heading', { name: characterLuke.name })).toHaveCount(0);
    await expect(page.getByLabel('Reactions for Darth Vader')).toContainText('👻');

    const page2 = parseCharactersUrl(requests[requests.length - 1]);
    expect(page2.name).toBe('sky');
    expect(page2.page).toBe('2');
    expect(page2.limit).toBe('4');

    await expect(previousPageButton(page)).toBeEnabled();
    await expect(nextPageButton(page)).toBeDisabled();

    await previousPageButton(page).click();
    await expectCharacterVisible(page, characterLuke);
    const page1 = parseCharactersUrl(requests[requests.length - 1]);
    expect(page1.page).toBe('1');
  });

  test('does not issue duplicate page requests while loading', async ({ page }) => {
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    const requests: string[] = [];

    await mockCharacters(page, async (route) => {
      const url = route.request().url();
      const { page: pageParam } = parseCharactersUrl(url);
      requests.push(url);

      if (pageParam === '2') {
        await gate;
      }

      await successPageHandler(twoPageDataset)(route);
    });

    await gotoApp(page);
    await submitSearch(page, 'sky');
    await expectCharacterVisible(page, characterLuke);

    const before = requests.length;
    await nextPageButton(page).click();
    await expect(nextPageButton(page)).toBeDisabled();
    await nextPageButton(page).click({ force: true }).catch(() => undefined);
    await page.getByRole('button', { name: 'Page 2' }).click({ force: true }).catch(() => undefined);

    expect(requests.filter((url) => parseCharactersUrl(url).page === '2')).toHaveLength(1);
    expect(requests.length).toBe(before + 1);

    release();
    await expectCharacterVisible(page, twoPageDataset[2].results[0]);
  });

  test('keeps query when changing pages', async ({ page }) => {
    const requests: string[] = [];

    await mockCharacters(page, async (route) => {
      requests.push(route.request().url());
      await successPageHandler(twoPageDataset, { delayMs: 50 })(route);
    });
    await gotoApp(page);
    await submitSearch(page, 'sky');
    await nextPageButton(page).click();
    await expectCharacterVisible(page, twoPageDataset[2].results[0]);

    for (const url of requests) {
      expect(parseCharactersUrl(url).name).toBe('sky');
    }
  });
});
