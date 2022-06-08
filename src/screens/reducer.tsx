import { IGDB } from "../interfaces/igdb";
import { TMDB } from "../interfaces/tmdb";

export function reducer(
  state: any,
  action: {
    type: string;
    categoryIndex?: number;
    searchValue?: string;
    isSearchTriggered?: boolean;
    page?: number;
    initGames?: IGDB.Game.Game[];
    games?: IGDB.Game.Game[];
    option?: "Coming Soon" | "Now Playing" | "Popular" | "Trending";
  }
) {
  switch (action.type) {
    case "set-categoryIndex":
      // When categoryIndex is changed reset searchValue, isSearchTriggered, movies and games to initial values
      return {
        ...state,
        categoryIndex: action.categoryIndex,
        searchValue: "",
        isSearchTriggered: false,
        games: state.initGames,
      };
    case "set-searchValue":
      return {
        ...state,
        searchValue: action.searchValue,
      };
    case "set-isSearchTriggered":
      return {
        ...state,
        isSearchTriggered: action.isSearchTriggered,
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
    case "set-option":
      return {
        ...state,
        option: action.option,
        isSearchTriggered: false,
      };
    default:
      return state;
  }
}
