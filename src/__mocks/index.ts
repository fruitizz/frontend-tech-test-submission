import { http, HttpResponse } from 'msw';
import { nameStartsWithQuery } from '../lib/search';
import { allCharacters, allReactions } from './data';
export const handlers = [
  http.get('/api/characters', ({ request }) => {
    const url = new URL(request.url);
    const searchName = url.searchParams.get('name') || '';
    const pageParam = url.searchParams.get('page');
    const limitParam = url.searchParams.get('limit');
    let filteredData = allCharacters;
    if (searchName) {
      // Brief requires results whose name starts with the typed text, not
      // an anywhere-in-string match.
      filteredData = allCharacters.filter(character =>
        nameStartsWithQuery(character.name, searchName)
      );
    }

    if (!pageParam || !limitParam) {
      return HttpResponse.json({
        results: filteredData,
        total: filteredData.length,
        page: 1,
        limit: filteredData.length,
        next: null,
        previous: null,
      }, { status: 200 });
    }
    const page = parseInt(pageParam, 10);
    const pageSize = parseInt(limitParam, 10);
    const totalCount = filteredData.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;
    const paginatedData = filteredData.slice(startIndex, endIndex);
    return HttpResponse.json({
      results: paginatedData,
      total: totalCount,
      page: page,
      limit: pageSize,
      next: page < totalPages ? `/api/characters?page=${page + 1}&limit=${pageSize}&name=${searchName}` : null,
      previous: page > 1 ? `/api/characters?page=${page - 1}&limit=${pageSize}&name=${searchName}` : null,
    }, { status: 200 });
  }),

  http.get('/api/reactions', () => {
    return HttpResponse.json({
      reactions: allReactions,
    }, { status: 200 });
  }),
];
