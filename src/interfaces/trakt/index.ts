export interface Ids {
  trakt: number;
  slug: string;
  imdb: string;
  tmdb: number;
}

export interface Movie {
  title: string;
  year: number;
  ids: Ids;
}

export interface ExtendedMovie extends Movie {
  tagline: string;
  overview: string;
  released: string;
  runtime: number;
  country: string;
  trailer: string;
  homepage: string;
  status: string;
  rating: number;
  votes: number;
  comment_count: number;
  updated_at: Date;
  language: string;
  available_translations: string[];
  genres: string[];
  certification: string;
}

interface ShowIds extends Ids {
  tvdb: number;
}

export type Show = Movie & {
  ids: ShowIds;
};
