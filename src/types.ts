export interface Character {
  id: number;
  name: string;
  species?: string;
  birthYear?: string;
  description?: string;
  imageUrl?: string;
  affiliations: string[];
}

export interface Reaction {
  id: string;
  content: string;
  characterId: number;
  deleted: boolean;
}

export interface GetCharactersParams {
  name: string;
  page: number;
  limit: number;
}

export interface CharactersResponse {
  results: Character[];
  total: number;
  page: number;
  limit: number;
  next: string | null;
  previous: string | null;
}

export interface ReactionsResponse {
  reactions: Reaction[];
}
