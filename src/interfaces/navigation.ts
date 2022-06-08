import { IGDB } from "./igdb";
import { Movie, MovieWatchProvider, TMDB } from "./tmdb";
import { Trakt } from "./trakt";

export namespace Navigation {
  export type TabNavigationParamList = {
    FindTab: undefined;
    CountdownTab: undefined;
    ProfileTab: undefined;
  };

  type MovieScreens = {
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

  export type FindStackParamList = {
    Find: undefined;
    Game: { game: IGDB.Game.Game };
    GameDiscover: { genre?: any; company?: any; keyword?: any };
  } & MovieScreens;

  export type CountdownStackParamList = {
    Countdown: undefined;
  } & MovieScreens;

  export type ProfileStackParamList = {
    Profile: undefined;
  };
}
