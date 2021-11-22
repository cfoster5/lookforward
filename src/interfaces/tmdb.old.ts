export namespace TMDB {
  export interface Response {
    page: number;
    results: Movie.Movie[];
    total_pages: number;
    total_results: number;
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

  interface ProductionCountry {
    iso_3166_1: string;
    name: string;
  }

  interface SpokenLanguage {
    english_name?: string;
    iso_639_1: string;
    name: string;
  }

  interface VideoResult {
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
  }

  export interface Keyword {
    id: number;
    name: string;
  }

  interface Image {
    aspect_ratio: number;
    file_path: string;
    height: number;
    iso_639_1: string | null;
    vote_average: number;
    vote_count: number;
    width: number;
  }

  interface Images {
    backdrops: Image[];
    posters: Image[];
  }

  export namespace Movie {
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

    interface ReleaseDate {
      iso_3166_1: string;
      release_dates: {
        certification: string;
        iso_639_1: string;
        release_date: string;
        type: number;
        note: string;
      }[];
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

    interface Details {
      adult: boolean;
      backdrop_path: string | null;
      belongs_to_collection?: object | null;
      budget: number;
      genres: Genre[];
      homepage: string | null;
      id: number;
      imdb_id: string | null;
      original_language: string;
      original_title: string;
      overview: string | null;
      popularity: number;
      poster_path: string | null;
      production_companies: ProductionCompany[];
      production_countries: ProductionCountry[];
      release_date: string;
      revenue: number;
      runtime: number | null;
      spoken_languages: SpokenLanguage[];
      status:
        | "Rumored"
        | "Planned"
        | "In Production"
        | "Post Production"
        | "Released"
        | "Canceled";
      tagline: string | null;
      title: string;
      video: boolean;
      vote_average: number;
      vote_count: number;
    }

    export interface DetailsExtended extends Details {
      keywords: { keywords: Keyword[] };
      credits: Credits;
      similar: Response;
      recommendations: Response;
      videos: { results: VideoResult[] };
      release_dates: { results: ReleaseDate[] };
      images: Images;
    }
  }

  export namespace MovieCredits {
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

  export namespace Show {
    interface CreatedBy {
      id: number;
      credit_id: string;
      name: string;
      gender: number;
      profile_path: string;
    }

    interface LastEpisodeToAir {
      air_date: string;
      episode_number: number;
      id: number;
      name: string;
      overview: string;
      production_code: string;
      season_number: number;
      still_path: string;
      vote_average: number;
      vote_count: number;
    }

    interface NextEpisodeToAir {
      air_date: string;
      episode_number: number;
      id: number;
      name: string;
      overview: string;
      production_code: string;
      season_number: number;
      still_path: string;
      vote_average: number;
      vote_count: number;
    }

    interface Network {
      name: string;
      id: number;
      logo_path: string;
      origin_country: string;
    }

    interface Season {
      air_date: string;
      episode_count: number;
      id: number;
      name: string;
      overview: string;
      poster_path: string;
      season_number: number;
    }

    export interface Show {
      backdrop_path: string;
      created_by: CreatedBy[];
      episode_run_time: number[];
      first_air_date: string;
      genres: Genre[];
      homepage: string;
      id: number;
      in_production: boolean;
      languages: string[];
      last_air_date: string;
      last_episode_to_air: LastEpisodeToAir;
      name: string;
      next_episode_to_air: NextEpisodeToAir;
      networks: Network[];
      number_of_episodes: number;
      number_of_seasons: number;
      origin_country: string[];
      original_language: string;
      original_name: string;
      overview: string;
      popularity: number;
      poster_path: string;
      production_companies: ProductionCompany[];
      production_countries: ProductionCountry[];
      seasons: Season[];
      spoken_languages: SpokenLanguage[];
      status: string;
      tagline: string;
      type: string;
      vote_average: number;
      vote_count: number;
      videos: { results: VideoResult[] };
    }
  }

  export interface Person {
    adult: boolean;
    also_known_as: string[];
    biography: string;
    birthday?: string;
    deathday?: string;
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
      cast: TMDB.MovieCredits.Cast[];
      crew: TMDB.MovieCredits.Crew[];
    };
    images: {
      profiles: {
        aspect_ratio: number;
        height: number;
        iso_639_1?: any;
        file_path: string;
        vote_average: number;
        vote_count: number;
        width: number;
      }[];
    };
  }
}

export interface MovieWatchProvider {
  display_priority: number;
  logo_path: string;
  provider_id: number;
  provider_name: string;
}
