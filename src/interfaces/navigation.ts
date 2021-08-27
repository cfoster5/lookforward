import { IGDB } from "./igdb"
import { TMDB } from "./tmdb"
import { Trakt } from "./trakt"

export namespace Navigation {

  export type TabNavigationParamList = {
    Find: undefined;
    Countdown: undefined;
    Profile: undefined;
  }

  export type FindStackParamList = {
    Find: undefined,
    Details: { type: "game" | "movie" | "tv", data: IGDB.Game.Game | TMDB.Movie.Movie | Trakt.ShowPremiere | Trakt.ShowSearch },
    MovieDiscover: { genre?: any, company?: any, keyword?: any },
    GameDiscover: { genre?: any, company?: any, keyword?: any },
    Actor: TMDB.Movie.Cast | TMDB.Movie.Crew
  }

  export type CountdownStackParamList = {
    Countdown: undefined
    Details: { type: "game" | "movie" | "tv", data: IGDB.Game.Game | TMDB.Movie.Movie | Trakt.ShowPremiere },
    MovieDiscover: { genre?: TMDB.Genre, company?: TMDB.ProductionCompany, keyword?: TMDB.Movie.Keywords },
    Actor: TMDB.Movie.Cast | TMDB.Movie.Crew
  }

  export type ProfileStackParamList = {
    Profile: undefined,
  }

}
