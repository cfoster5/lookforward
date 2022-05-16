import { IGDB } from "../interfaces/igdb";
import { TMDB } from "../interfaces/tmdb";

export function reducer(
  state: any,
  action: {
    type: string;
    categoryIndex?: number;
    searchValue?: string;
    triggeredSearch?: boolean;
    pageIndex?: number;
    initGames?: IGDB.Game.Game[];
    games?: IGDB.Game.Game[];
    initMovies?: TMDB.BaseMovie[];
    movies?: (
      | TMDB.BaseMovie
      | TMDB.Search.MultiSearchResult
      | TMDB.Trending.Movie
    )[];
  }
) {
  switch (action.type) {
    case "set-categoryIndex":
      // When categoryIndex is changed reset searchValue, triggeredSearch, movies and games to initial values
      return {
        ...state,
        categoryIndex: action.categoryIndex,
        searchValue: "",
        triggeredSearch: false,
        movies: state.initMovies,
        games: state.initGames,
      };
    case "set-searchValue":
      return {
        ...state,
        searchValue: action.searchValue,
      };
    case "set-triggeredSearch":
      return {
        ...state,
        triggeredSearch: action.triggeredSearch,
        pageIndex: 1,
      };
    case "set-pageIndex":
      return {
        ...state,
        pageIndex: action.pageIndex,
      };
    case "set-initMovies":
      return {
        ...state,
        initMovies: action.initMovies,
        movies: action.initMovies,
      };
    case "set-movies":
      return {
        ...state,
        movies: action.movies,
      };
    case "set-initGames":
      return {
        ...state,
        initGames: action.initGames,
        games: action.initGames,
      };
    case "set-games":
      return {
        ...state,
        games: action.games,
      };
    default:
      return state;
  }
}
