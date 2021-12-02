import { IGDB } from "./igdb";
import { MovieWatchProvider, TMDB } from "./tmdb";
import { Trakt } from "./trakt";

export namespace Navigation {
  export type TabNavigationParamList = {
    FindTab: undefined;
    CountdownTab: undefined;
    ProfileTab: undefined;
  };

  export type FindStackParamList = {
    Find: undefined;
    Details: // | { type: "game"; data: IGDB.Game.Game }
    // | { type: "movie"; data: TMDB.Movie.Movie }
    // | { type: "tv"; data: Trakt.ShowPremiere | Trakt.ShowSearch };
    { movie?: TMDB.BaseMovie; game?: IGDB.Game.Game };
    MovieDiscover: {
      genre?: TMDB.Genre;
      company?: TMDB.ProductionCompany;
      keyword?: TMDB.Movie.Keywords;
      provider?: MovieWatchProvider;
    };
    GameDiscover: { genre?: any; company?: any; keyword?: any };
    Actor: TMDB.Movie.Cast | TMDB.Movie.Crew;
  };

  export type CountdownStackParamList = {
    Countdown: undefined;
    Details: { movie: TMDB.BaseMovie };
    MovieDiscover: {
      genre?: TMDB.Genre;
      company?: TMDB.ProductionCompany;
      keyword?: TMDB.Movie.Keywords;
      provider?: MovieWatchProvider;
    };
    Actor: TMDB.Movie.Cast | TMDB.Movie.Crew;
  };

  export type ProfileStackParamList = {
    Profile: undefined;
  };
}
