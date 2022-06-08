import { IGDB } from "./igdb";
import { Movie, MovieWatchProvider, TMDB } from "./tmdb";
import { Trakt } from "./trakt";

export namespace Navigation {
  export type TabNavigationParamList = {
    FindTab: undefined;
    CountdownTab: undefined;
    ProfileTab: undefined;
  };

  export type FindStackParamList = {
    Find: undefined;
    Movie: { movieId: Movie["id"]; movieTitle: Movie["title"] };
    Game: { game: IGDB.Game.Game };
    MovieDiscover: {
      genre?: TMDB.Genre;
      company?: TMDB.ProductionCompany;
      keyword?: TMDB.Movie.Keywords;
      provider?: MovieWatchProvider;
    };
    GameDiscover: { genre?: any; company?: any; keyword?: any };
    Actor: { personId: number };
    Collection: { collectionId: number };
  };

  export type CountdownStackParamList = {
    Countdown: undefined;
    Movie: { movieId: Movie["id"]; movieTitle: Movie["title"] };
    MovieDiscover: {
      genre?: TMDB.Genre;
      company?: TMDB.ProductionCompany;
      keyword?: TMDB.Movie.Keywords;
      provider?: MovieWatchProvider;
    };
    Actor: { personId: number };
    Collection: { collectionId: number };
  };

  export type ProfileStackParamList = {
    Profile: undefined;
  };
}
