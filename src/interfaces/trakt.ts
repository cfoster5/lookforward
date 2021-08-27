import { TMDB } from "./tmdb";

export namespace Trakt {

  interface EpisodeIds {
    trakt: number;
    tvdb?: number;
    imdb: string;
    tmdb?: number;
    tvrage?: any;
  }

  export interface Episode {
    season: number;
    number: number;
    title: string;
    ids: EpisodeIds;
  }

  interface ShowIds {
    trakt: number;
    slug: string;
    tvdb?: number;
    imdb: string;
    tmdb?: number;
    tvrage?: number;
  }

  export interface Airs {
    day: string;
    time: string;
    timezone: string;
  }

  export interface Show {
    title: string;
    year: number;
    ids: ShowIds;
    tmdbData?: TMDB.Show.Show;
    overview: string;
    first_aired: Date;
    airs: Airs;
    runtime: number;
    certification: string;
    network: string;
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
    aired_episodes: number;
  }

  export interface ShowPremiere {
    first_aired: Date;
    episode: Episode;
    show: Show;
    // documentID is from Firestore
    documentID?: number;
  }

  export interface ShowSearch {
    type: string;
    score: number;
    show: Show;
    // documentID is from Firestore
    documentID?: number;
  }

  export interface NextEpisode {
    season: number;
    number: number;
    title: string;
    ids: EpisodeIds;
    number_abs?: any;
    overview: string;
    rating: number;
    votes: number;
    comment_count: number;
    first_aired: Date;
    updated_at: Date;
    available_translations: any[];
    runtime: number;
  }

  interface PersonIds {
    trakt: number;
    slug: string;
    imdb: string;
    tmdb: number;
    tvrage?: number;
  }

  interface Person {
    name: string;
    ids: PersonIds;
    tmdbData?: TMDB.Person;
  }

  export interface Cast {
    character: string;
    characters: string[];
    episode_count: number;
    person: Person;
  }

  export interface Role {
    job: string;
    jobs: string[];
    episode_count: number;
    person: Person;
  }

  export interface Crew {
    production: Role[];
    "visual effects": Role[];
    writing: Role[];
    art: Role[];
    "costume & make-up": Role[];
    sound: Role[];
    editing: Role[];
    camera: Role[];
    directing: Role[];
    crew: Role[];
    "created by": Role[];
  }

  export interface ShowPeople {
    cast: Cast[];
    crew: Crew;
  }

}
