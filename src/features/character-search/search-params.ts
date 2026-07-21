import { GetCharactersParams } from '../../types';

export const PAGE_SIZE = 4;

export function buildGetCharactersParams(
  name: string,
  page: number,
): GetCharactersParams {
  return {
    name,
    page,
    limit: PAGE_SIZE,
  };
}
