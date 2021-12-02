export namespace TMDB {
  export interface BaseResponse<T> {
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
  }

  export interface BaseMovie {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
  }

  export namespace Search {
    export interface MultiSearchResult extends BaseMovie {
      media_type: "movie" | "tv" | "person";
      first_air_date: string;
      name: string;
      origin_country: string[];
      original_name: string;
    }
  }

  export namespace Movie {
    export interface Details extends BaseMovie {
      belongs_to_collection: BelongsToCollection;
      budget: number;
      genres: Genre[];
      homepage: string;
      imdb_id: string;
      production_companies: ProductionCompany[];
      production_countries: ProductionCountry[];
      revenue: number;
      runtime: number;
      spoken_languages: SpokenLanguage[];
      status:
        | "Rumored"
        | "Planned"
        | "In Production"
        | "Post Production"
        | "Released"
        | "Canceled";
      tagline: string;
      credits: { cast: Cast[]; crew: Crew[] };
      similar: BaseResponse<BaseMovie>;
      videos: Videos;
      release_dates: ReleaseDates;
      keywords: Keywords;
      recommendations: BaseResponse<BaseMovie>;
    }

    export namespace Upcoming {
      export interface Response extends BaseResponse<BaseMovie> {
        dates: { maximum: string; minimum: string };
      }
    }
  }

  // Movie
  export interface BelongsToCollection {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
  }

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
    english_name: string;
    iso_639_1: string;
    name: string;
  }

  export interface Credit {
    adult: boolean;
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: string;
    credit_id: string;
  }

  export interface Cast extends Credit {
    cast_id: number;
    character: string;
    order: number;
  }

  export interface Crew extends Credit {
    department: string;
    job: string;
  }

  export interface Videos {
    results: {
      iso_639_1: string;
      iso_3166_1: string;
      name: string;
      key: string;
      site: string;
      size: number;
      type: string;
      official: boolean;
      published_at: string;
      id: string;
    }[];
  }

  export interface ReleaseDate {
    certification: string;
    iso_639_1: string;
    note: string;
    release_date: Date;
    type: number;
  }

  export interface ReleaseDates {
    results: { iso_3166_1: string; release_dates: ReleaseDate[] }[];
  }

  export interface Keyword {
    id: number;
    name: string;
  }

  export interface Keywords {
    keywords: Keyword[];
  }

  export namespace Person {
    export interface Profile {
      aspect_ratio: number;
      height: number;
      iso_639_1?: any;
      file_path: string;
      vote_average: number;
      vote_count: number;
      width: number;
    }

    export interface Images {
      profiles: Profile[];
    }

    export interface Person {
      adult: boolean;
      also_known_as: string[];
      biography: string;
      birthday: string;
      deathday?: any;
      gender: number;
      homepage?: any;
      id: number;
      imdb_id: string;
      known_for_department: string;
      name: string;
      place_of_birth: string;
      popularity: number;
      profile_path: string;
      movie_credits: {
        cast: {
          adult: boolean;
          backdrop_path: string;
          genre_ids: number[];
          original_language: string;
          original_title: string;
          poster_path: string;
          vote_count: number;
          video: boolean;
          vote_average: number;
          title: string;
          overview: string;
          id: number;
          release_date: string;
          popularity: number;
          character: string;
          credit_id: string;
          order: number;
        }[];
        crew: {
          video: boolean;
          vote_average: number;
          id: number;
          overview: string;
          release_date: string;
          adult: boolean;
          backdrop_path: string;
          vote_count: number;
          genre_ids: number[];
          original_language: string;
          original_title: string;
          poster_path: string;
          title: string;
          popularity: number;
          credit_id: string;
          department: string;
          job: string;
        }[];
      };
      images: Images;
    }
  }

  // Trending movie
  export namespace Trending {
    export interface Movie extends BaseMovie {
      media_type: "movie";
    }
  }

  export namespace WatchProviders {
    export interface Movie {
      display_priority: number;
      logo_path: string;
      provider_id: number;
      provider_name: string;
    }
  }
}
