export interface cover {
  id: number;
  alpha_channel: boolean;
  animated: boolean;
  game: number;
  height: number;
  image_id: string;
  url: string;
  width: number;
  checksum: string;
}

export interface genre {
  id: number,
  name: string
}

// export interface platform {
//   id: number;
//   abbreviation: string;
//   alternative_name: string;
//   category: number;
//   created_at: number;
//   generation: number;
//   name: string;
//   platform_logo: number;
//   product_family: number;
//   slug: string;
//   summary: string;
//   updated_at: number;
//   url: string;
//   versions: number[];
//   websites: number[];
//   checksum: string;
// }

// export interface release {
//   id: number;
//   category: number;
//   created_at: number;
//   date: number;
//   game: number;
//   human: string;
//   m: number;
//   platform: platform;
//   region: number;
//   updated_at: number;
//   y: number;
//   checksum: string;
// }

// export interface game {
//   id: number;
//   cover: cover;
//   genres: genre[];
//   name: string;
//   release_dates: release[];
//   summary: string;
// }




export interface game {
  id: number;
  cover: cover;
  genres: genre[];
  name: string;
  summary: string;
}

export interface platform {
  id: number;
  abbreviation: string;
  alternative_name: string;
  category: number;
  created_at: number;
  name: string;
  platform_logo: number;
  slug: string;
  updated_at: number;
  url: string;
  versions: number[];
  websites: number[];
  checksum: string;
  generation?: number;
  product_family?: number;
  summary: string;
}

export interface release {
  id: number;
  category: number;
  created_at: number;
  date: number;
  game: game;
  human: string;
  m: number;
  platform: platform;
  region: number;
  updated_at: number;
  y: number;
  checksum: string;
}

//// TMDB ////
// export declare module TMDB {
export namespace TMDB {

  export namespace Movie {
    export interface Genre {
      id: number;
      name: string;
    }

    export interface ProductionCompany {
      id: number;
      logo_path: string;
      name: string;
      origin_country: string;
    }

    export interface ProductionCountry {
      iso_3166_1: string;
      name: string;
    }

    export interface SpokenLanguage {
      iso_639_1: string;
      name: string;
    }

    export interface Cast {
      cast_id: number;
      character: string;
      credit_id: string;
      gender: number;
      id: number;
      name: string;
      order: number;
      profile_path: string;
    }

    export interface Crew {
      credit_id: string;
      department: string;
      gender: number;
      id: number;
      job: string;
      name: string;
      profile_path: string;
    }

    export interface Credits {
      cast: Cast[];
      crew: Crew[];
    }

    export interface Movie {
      id: number;
      video: boolean;
      vote_count: number;
      vote_average: number;
      title: string;
      release_date: string;
      original_language: string;
      original_title: string;
      genre_ids: number[];
      backdrop_path: string;
      adult: boolean;
      overview: string;
      poster_path: string;
      popularity: number;
    }

    export interface Response {
      page: number;
      results: Movie[];
      total_pages: number;
      total_results: number;
    }

    export interface VideoResult {
      id: string;
      iso_639_1: string;
      iso_3166_1: string;
      key: string;
      name: string;
      site: string;
      size: number;
      type: string;
    }

    export interface Details {
      adult: boolean;
      backdrop_path: string;
      belongs_to_collection?: any;
      budget: number;
      genres: Genre[];
      homepage: string;
      id: number;
      imdb_id: string;
      original_language: string;
      original_title: string;
      overview: string;
      popularity: number;
      poster_path: string;
      production_companies: ProductionCompany[];
      production_countries: ProductionCountry[];
      release_date: string;
      revenue: number;
      runtime: number;
      spoken_languages: SpokenLanguage[];
      status: string;
      tagline: string;
      title: string;
      video: boolean;
      vote_average: number;
      vote_count: number;
      credits: Credits;
      similar: Response;
      videos: { results: VideoResult[] };
      release_dates: { results: any[] };
    }
  }

  export namespace Person {
    // /person/{person_id}
    export interface Cast {
      character: string;
      credit_id: string;
      release_date: string;
      vote_count: number;
      video: boolean;
      adult: boolean;
      vote_average: number;
      title: string;
      genre_ids: number[];
      original_language: string;
      original_title: string;
      popularity: number;
      id: number;
      backdrop_path: string;
      overview: string;
      poster_path: string;
    }

    export interface Crew {
      id: number;
      department: string;
      original_language: string;
      original_title: string;
      job: string;
      overview: string;
      vote_count: number;
      video: boolean;
      poster_path: string;
      backdrop_path: string;
      title: string;
      popularity: number;
      genre_ids: number[];
      vote_average: number;
      adult: boolean;
      release_date: string;
      credit_id: string;
    }

    export interface Credits {
      cast: Cast[];
      crew: Crew[];
      id: number;
    }
  }

}

import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack"
// export declare module Navigation {
export namespace Navigation {
  export type HomeStackParamList = {
    Find: undefined,
    Details: { type: "game" | "movie", data: release | TMDB.Movie.Movie },
    Actor: TMDB.Movie.Cast
  }

  type FindScreenRouteProp = RouteProp<HomeStackParamList, 'Find'>;
  type FindScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Find'>;
  export type FindScreenProps = {
    route: FindScreenRouteProp;
    navigation: FindScreenNavigationProp;
  }

  type DetailsScreenRouteProp = RouteProp<HomeStackParamList, 'Details'>;
  type DetailsScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Details'>;
  export type DetailsScreenProps = {
    route: DetailsScreenRouteProp;
    navigation: DetailsScreenNavigationProp;
  }

  type ActorScreenRouteProp = RouteProp<HomeStackParamList, 'Actor'>;
  type ActorScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Actor'>;
  export type ActorScreenProps = {
    route: ActorScreenRouteProp;
    navigation: ActorScreenNavigationProp;
  }

  export type AuthStackParamList = {
    Welcome: undefined,
    "Create Account": undefined
    "Sign In": undefined
  }
  export type StackParamList = {
    Home: undefined,
    Welcome: undefined
  }

}
