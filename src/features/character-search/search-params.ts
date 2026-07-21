import { SearchCharactersInput } from '../../api';

export const PAGE_SIZE = 4 as const;

export function buildSearchCharactersInput(
  query: string,
  page: number,
  signal?: AbortSignal,
): SearchCharactersInput {
  return {
    query,
    page,
    pageSize: PAGE_SIZE,
    signal,
  };
}
