export namespace IGDB {

  export namespace Game {
    export interface Cover {
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

    export interface Genre {
      id: number;
      name: string;
    }

    export interface Platform {
      id: number;
      name: string;
      abbreviation: string;
    }

    export interface ReleaseDate {
      id: number;
      category: number;
      created_at: number;
      date: number;
      game: number;
      human: string;
      m: number;
      platform: Platform;
      region: number;
      updated_at: number;
      y: number;
      checksum: string;
    }

    export interface Video {
      id: number;
      name: string;
      video_id: string;
    }

    export interface Company {
      id: number,
      name: string
    }

    export interface InvolvedCompany {
      id: number,
      company: Company,
      developer: true,
      porting: false,
      publisher: false,
      supporting: false
    }

    export interface Game {
      id: number;
      cover: Cover;
      genres: Genre[];
      name: string;
      release_dates: ReleaseDate[];
      summary: string;
      videos: Video[];
      involved_companies: InvolvedCompany[];
    }
  }

  export namespace ReleaseDate {
    export interface Game {
      id: number;
      cover: IGDB.Game.Cover;
      genres: IGDB.Game.Genre[];
      name: string;
      summary: string;
      videos: IGDB.Game.Video[];
      involved_companies: IGDB.Game.InvolvedCompany[];
    }

    export interface ReleaseDate {
      id: number;
      category: number;
      created_at: number;
      date: number;
      game: Game;
      human: string;
      m: number;
      platform: IGDB.Game.Platform;
      region: number;
      updated_at: number;
      y: number;
      checksum: string;
    }
  }
}

export namespace TMDB {

  interface Genre {
    id: number;
    name: string;
  }

  interface ProductionCompany {
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
    }

  }

}

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

}

import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack"
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

export interface IGDBCredentials {
  access_token: string;
  expires_in: number;
  modified: number;
  token_type: "bearer";
}

// export declare module Navigation {
export namespace Navigation {

  export type TabNavigationParamList = {
    Find: { uid: string, igdbCreds: IGDBCredentials }
    Countdown: { uid: string }
    Profile: { uid: string }
  }

  // type TabsScreenRouteProp = RouteProp<RootStackParamList, "Tabs">
  // type TabsScreenNavigationProp = BottomTabNavigationProp<RootStackParamList, "Tabs">;
  // export type TabsScreenProps = {
  //   route: TabsScreenRouteProp;
  //   navigation: TabsScreenNavigationProp;
  // }

  export type FindStackParamList = {
    Find: { uid: string, igdbCreds: IGDBCredentials },
    Details: { type: "game" | "movie" | "tv", data: IGDB.Game.Game | TMDB.Movie.Movie | Trakt.ShowPremiere, uid: string },
    Actor: TMDB.Movie.Cast | TMDB.Movie.Crew
  }

  // type FindScreenRouteProp = RouteProp<FindStackParamList, 'Find'>;
  // type FindScreenNavigationProp = StackNavigationProp<FindStackParamList, 'Find'>;
  // export type FindScreenProps = {
  //   route: FindScreenRouteProp;
  //   navigation: FindScreenNavigationProp;
  //   countdownMovies: any;
  //   countdownGames: any;
  // }

  // type DetailsScreenRouteProp = RouteProp<FindStackParamList, 'Details'>;
  // type DetailsScreenNavigationProp = StackNavigationProp<FindStackParamList, 'Details'>;
  // export type DetailsScreenProps = {
  //   route: DetailsScreenRouteProp;
  //   navigation: DetailsScreenNavigationProp;
  //   countdownMovies: any;
  //   countdownGames: any;
  // }

  // type ActorScreenRouteProp = RouteProp<FindStackParamList, 'Actor'>;
  // type ActorScreenNavigationProp = StackNavigationProp<FindStackParamList, 'Actor'>;
  // export type ActorScreenProps = {
  //   route: ActorScreenRouteProp;
  //   navigation: ActorScreenNavigationProp;
  // }

  export type CountdownStackParamList = {
    Countdown: { uid: string }
  }

  export type AuthStackParamList = {
    Welcome: undefined,
    "Create Account": undefined
    "Sign In": undefined
    "Password Reset": undefined
  }

  export type ProfileStackParamList = {
    Profile: { uid: string | undefined },
  }

  type ProfileScreenRouteProp = RouteProp<ProfileStackParamList, 'Profile'>;
  type ProfileScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'Profile'>;
  export type ProfileScreenProps = {
    route: ProfileScreenRouteProp;
    navigation: ProfileScreenNavigationProp;
    dayNotifications: boolean;
    weekNotifications: boolean;
  }

}
