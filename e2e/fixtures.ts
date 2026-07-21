import type { Character, CharactersResponse, Reaction } from '../src/types';

export const characterLuke: Character = {
  id: 1,
  name: 'Luke Skywalker',
  species: 'Human',
  birthYear: '19BBY',
  description: 'A Jedi knight from Tatooine.',
  affiliations: ['Rebel Alliance', 'Jedi Order'],
};

export const characterLeia: Character = {
  id: 2,
  name: 'Leia Organa',
  species: 'Human',
  birthYear: '19BBY',
  description: 'Princess of Alderaan and Rebel leader.',
  affiliations: ['Rebel Alliance'],
};

export const characterHan: Character = {
  id: 3,
  name: 'Han Solo',
  species: 'Human',
  birthYear: '29BBY',
  description: 'Smuggler and Rebel general.',
  affiliations: ['Rebel Alliance'],
};

export const characterChewie: Character = {
  id: 4,
  name: 'Chewbacca',
  species: 'Wookiee',
  birthYear: '200BBY',
  description: 'Wookiee warrior and co-pilot.',
  affiliations: ['Rebel Alliance'],
};

export const characterVader: Character = {
  id: 5,
  name: 'Darth Vader',
  species: 'Human',
  birthYear: '41.9BBY',
  description: 'Sith Lord of the Galactic Empire.',
  affiliations: ['Galactic Empire', 'Sith'],
};

export const page1Characters = [
  characterLuke,
  characterLeia,
  characterHan,
  characterChewie,
];

export const page2Characters = [characterVader];

export function charactersResponse(
  results: Character[],
  {
    page,
    total,
    limit = 4,
  }: { page: number; total: number; limit?: number },
): CharactersResponse {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return {
    results,
    total,
    page,
    limit,
    next:
      page < totalPages
        ? `/api/characters?page=${page + 1}&limit=${limit}&name=sky`
        : null,
    previous:
      page > 1
        ? `/api/characters?page=${page - 1}&limit=${limit}&name=sky`
        : null,
  };
}

export const defaultReactions: Reaction[] = [
  {
    id: 'r1',
    content: '⭐',
    characterId: characterLuke.id,
    deleted: false,
  },
  {
    id: 'r2',
    content: '💙',
    characterId: characterLuke.id,
    deleted: false,
  },
  {
    id: 'r3',
    content: '🚀',
    characterId: characterLeia.id,
    deleted: false,
  },
  {
    id: 'r4',
    content: '👻',
    characterId: characterVader.id,
    deleted: false,
  },
  {
    id: 'r5',
    content: '🗑️',
    characterId: characterHan.id,
    deleted: true,
  },
];

export const emptyCharactersResponse = charactersResponse([], {
  page: 1,
  total: 0,
});
