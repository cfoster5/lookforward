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
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
// export declare module Navigation {
export namespace Navigation {
  export type RootStackParamList = {
    Tabs: { uid: string | undefined, igdbCreds: any },
    Welcome: undefined
  }

  export type TabNavigationParamList = {
    Find: { uid: string, igdbCreds: any }
    Countdown: { uid: string }
    Profile: { uid: string }
  }

  type TabsScreenRouteProp = RouteProp<RootStackParamList, "Tabs">
  type TabsScreenNavigationProp = BottomTabNavigationProp<RootStackParamList, "Tabs">;
  export type TabsScreenProps = {
    route: TabsScreenRouteProp;
    navigation: TabsScreenNavigationProp;
  }

  export type FindStackParamList = {
    Find: { uid: string | undefined, igdbCreds: any },
    Details: { type: "game" | "movie", data: IGDB.Game.Game | TMDB.Movie.Movie, uid: string | undefined },
    Actor: TMDB.Movie.Cast | TMDB.Movie.Crew
  }

  type FindScreenRouteProp = RouteProp<FindStackParamList, 'Find'>;
  type FindScreenNavigationProp = StackNavigationProp<FindStackParamList, 'Find'>;
  export type FindScreenProps = {
    route: FindScreenRouteProp;
    navigation: FindScreenNavigationProp;
    countdownMovies: any;
    countdownGames: any;
  }

  type DetailsScreenRouteProp = RouteProp<FindStackParamList, 'Details'>;
  type DetailsScreenNavigationProp = StackNavigationProp<FindStackParamList, 'Details'>;
  export type DetailsScreenProps = {
    route: DetailsScreenRouteProp;
    navigation: DetailsScreenNavigationProp;
    countdownMovies: any;
    countdownGames: any;
  }

  type ActorScreenRouteProp = RouteProp<FindStackParamList, 'Actor'>;
  type ActorScreenNavigationProp = StackNavigationProp<FindStackParamList, 'Actor'>;
  export type ActorScreenProps = {
    route: ActorScreenRouteProp;
    navigation: ActorScreenNavigationProp;
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
