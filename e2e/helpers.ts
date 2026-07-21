import { expect, type Page, type Route } from '@playwright/test';

import {
  charactersResponse,
  defaultReactions,
  emptyCharactersResponse,
  page1Characters,
  page2Characters,
} from './fixtures';
import type { Character, CharactersResponse, Reaction } from '../src/types';

export const searchInput = (page: Page) =>
  page.getByRole('searchbox', { name: /search/i });

export const clearButton = (page: Page) =>
  page.getByRole('button', { name: 'Clear search' });

export const previousPageButton = (page: Page) =>
  page.getByRole('button', { name: 'Previous page' });

export const nextPageButton = (page: Page) =>
  page.getByRole('button', { name: 'Next page' });

export const retryButton = (page: Page) =>
  page.getByRole('button', { name: 'Retry' });

export async function mockReactions(
  page: Page,
  reactions: Reaction[] = defaultReactions,
) {
  await page.route('**/api/reactions**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ reactions }),
    });
  });
}

export async function mockCharacters(
  page: Page,
  handler: (route: Route) => Promise<void> | void,
) {
  await page.route('**/api/characters**', handler);
}

export async function fulfillJson(
  route: Route,
  body: unknown,
  status = 200,
) {
  await route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(body),
  });
}

export function parseCharactersUrl(url: string) {
  const parsed = new URL(url);
  return {
    name: parsed.searchParams.get('name') ?? '',
    page: parsed.searchParams.get('page'),
    limit: parsed.searchParams.get('limit'),
  };
}

export async function gotoApp(page: Page) {
  await mockReactions(page);
  await page.goto('/');
  await expect(searchInput(page)).toBeVisible();
}

export async function submitSearch(page: Page, query: string) {
  const input = searchInput(page);
  await input.fill(query);
  await input.press('Enter');
}

export function successPageHandler(
  byPage: Record<number, CharactersResponse>,
  options: { delayMs?: number } = {},
) {
  return async (route: Route) => {
    if (route.request().method() !== 'GET') {
      await route.fallback();
      return;
    }

    const { page: pageParam, limit } = parseCharactersUrl(route.request().url());
    const pageNumber = Number(pageParam ?? '1');
    const response = byPage[pageNumber];

    if (!response) {
      await fulfillJson(route, emptyCharactersResponse);
      return;
    }

    if (options.delayMs) {
      await new Promise((resolve) => setTimeout(resolve, options.delayMs));
    }

    expect(limit).toBe('4');
    await fulfillJson(route, response);
  };
}

export const twoPageDataset: Record<number, CharactersResponse> = {
  1: charactersResponse(page1Characters, { page: 1, total: 5 }),
  2: charactersResponse(page2Characters, { page: 2, total: 5 }),
};

export async function expectCharacterVisible(page: Page, character: Character) {
  await expect(page.getByRole('heading', { name: character.name })).toBeVisible();
}

export async function expectIdleState(page: Page) {
  await expect(
    page.getByText('Search for a character to get started.'),
  ).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Search results pagination' })).toHaveCount(0);
  await expect(page.getByText('No results matched your search.')).toHaveCount(0);
  await expect(page.getByText('Something went wrong')).toHaveCount(0);
}
