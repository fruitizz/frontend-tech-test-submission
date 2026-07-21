import { expect, test } from '@playwright/test';

import { characterLeia, characterLuke, emptyCharactersResponse } from './fixtures';
import {
  clearButton,
  expectCharacterVisible,
  expectIdleState,
  fulfillJson,
  gotoApp,
  mockCharacters,
  parseCharactersUrl,
  searchInput,
  submitSearch,
  successPageHandler,
  twoPageDataset,
} from './helpers';

test.describe('search workflow', () => {
  test('shows the idle initial state', async ({ page }) => {
    await gotoApp(page);

    await expect(searchInput(page)).toBeVisible();
    await expectIdleState(page);
    await expect(clearButton(page)).toHaveCount(0);
  });

  test('searches successfully with page 1 and limit 4', async ({ page }) => {
    const requests: string[] = [];

    await mockCharacters(page, async (route) => {
      requests.push(route.request().url());
      await successPageHandler(twoPageDataset, { delayMs: 250 })(route);
    });
    await gotoApp(page);

    await submitSearch(page, '  sky  ');

    await expect(page.getByText(/Searching for/)).toBeVisible();
    await expectCharacterVisible(page, characterLuke);
    await expectCharacterVisible(page, characterLeia);
    await expect(page.getByText('A Jedi knight from Tatooine.')).toBeVisible();
    await expect(page.getByText('Human').first()).toBeVisible();
    await expect(page.getByText('Rebel Alliance').first()).toBeVisible();
    await expect(page.getByLabel('Reactions for Luke Skywalker')).toContainText('⭐');
    await expect(page.getByLabel('Reactions for Luke Skywalker')).toContainText('💙');
    await expect(page.getByLabel('Reactions for Leia Organa')).toContainText('🚀');
    await expect(page.getByLabel('Reactions for Luke Skywalker')).not.toContainText('🚀');

    expect(requests.length).toBeGreaterThan(0);
    const last = parseCharactersUrl(requests[requests.length - 1]);
    expect(last.name).toBe('sky');
    expect(last.page).toBe('1');
    expect(last.limit).toBe('4');
  });

  test('shows empty state for zero results', async ({ page }) => {
    await mockCharacters(page, async (route) => {
      await fulfillJson(route, emptyCharactersResponse);
    });
    await gotoApp(page);

    await submitSearch(page, 'zzzzz');

    await expect(page.getByText('No results found')).toBeVisible();
    await expect(page.getByText('Something went wrong')).toHaveCount(0);
    await expect(searchInput(page)).toBeEnabled();
  });

  test('clears draft text without submitting a search', async ({ page }) => {
    const characterRequests: string[] = [];

    await mockCharacters(page, async (route) => {
      characterRequests.push(route.request().url());
      await fulfillJson(route, emptyCharactersResponse);
    });
    await gotoApp(page);

    await searchInput(page).fill('draft only');
    await expect(clearButton(page)).toBeVisible();
    await clearButton(page).click();

    await expect(searchInput(page)).toHaveValue('');
    expect(characterRequests).toHaveLength(0);
  });

  test('clears an active search back to idle and resets page', async ({ page }) => {
    const characterRequests: string[] = [];

    await mockCharacters(page, async (route) => {
      characterRequests.push(route.request().url());
      await successPageHandler(twoPageDataset)(route);
    });
    await gotoApp(page);

    await submitSearch(page, 'sky');
    await expectCharacterVisible(page, characterLuke);
    await page.getByRole('button', { name: 'Page 2' }).click();
    await expectCharacterVisible(page, twoPageDataset[2].results[0]);

    const beforeClear = characterRequests.length;
    await clearButton(page).click();

    await expect(searchInput(page)).toHaveValue('');
    await expectIdleState(page);
    expect(characterRequests.length).toBe(beforeClear);

    await submitSearch(page, 'sky');
    const last = parseCharactersUrl(characterRequests[characterRequests.length - 1]);
    expect(last.page).toBe('1');
  });

  test('smoke flow: search → page → clear → search again', async ({ page }) => {
    await mockCharacters(page, successPageHandler(twoPageDataset));
    await gotoApp(page);

    await submitSearch(page, 'sky');
    await expectCharacterVisible(page, characterLuke);
    await expect(page.getByLabel('Reactions for Luke Skywalker')).toContainText('⭐');

    await page.getByRole('button', { name: 'Next page' }).click();
    await expectCharacterVisible(page, twoPageDataset[2].results[0]);
    await expect(page.getByLabel('Reactions for Darth Vader')).toContainText('👻');

    await page.getByRole('button', { name: 'Previous page' }).click();
    await expectCharacterVisible(page, characterLuke);

    await clearButton(page).click();
    await expectIdleState(page);

    await submitSearch(page, 'sky');
    await expectCharacterVisible(page, characterLuke);
  });
});
