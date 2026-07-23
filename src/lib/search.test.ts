import { describe, expect, it } from 'vitest';

import { allCharacters } from '../__mocks/data';
import { nameStartsWithQuery, normalizeSearchQuery } from './search';

describe('normalizeSearchQuery', () => {
  it('trims surrounding whitespace', () => {
    expect(normalizeSearchQuery('  sky  ')).toBe('sky');
  });

  it('returns an empty string for whitespace-only input', () => {
    expect(normalizeSearchQuery('')).toBe('');
    expect(normalizeSearchQuery('   ')).toBe('');
  });
});

describe('nameStartsWithQuery', () => {
  it('matches when the name starts with the query, case-insensitively', () => {
    expect(nameStartsWithQuery('Luke Skywalker', 'Luke')).toBe(true);
    expect(nameStartsWithQuery('Luke Skywalker', 'luke')).toBe(true);
    expect(nameStartsWithQuery('Luke Skywalker', 'LUKE SKY')).toBe(true);
  });

  it('does not match when the query only appears mid-name', () => {
    // "Skywalker" is not a prefix of "Luke Skywalker" or "Anakin Skywalker".
    expect(nameStartsWithQuery('Luke Skywalker', 'Skywalker')).toBe(false);
    expect(nameStartsWithQuery('Anakin Skywalker', 'Skywalker')).toBe(false);
  });

  it('does not match a query that only appears somewhere in the name', () => {
    // "Padmé Amidala" contains an "a" but does not start with one.
    expect(nameStartsWithQuery('Padmé Amidala', 'a')).toBe(false);
  });

  it('filters the fixture dataset by prefix, not by "contains"', () => {
    const matches = allCharacters.filter((character) =>
      nameStartsWithQuery(character.name, 'a'),
    );

    // Only names starting with "a"/"A" — previously an "includes" match
    // returned 23 results for this single-letter query.
    expect(matches.map((character) => character.name).sort()).toEqual(
      ['Aayla Secura', 'Ahsoka Tano', 'Anakin Skywalker'].sort(),
    );

    expect(
      allCharacters.filter((character) =>
        nameStartsWithQuery(character.name, 'Skywalker'),
      ),
    ).toEqual([]);
  });
});
