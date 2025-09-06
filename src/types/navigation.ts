import {
  BelongsToCollection,
  Credits,
  Keywords,
  MovieDetails,
  WatchProviders,
} from "tmdb-ts";

import { Games, ReleaseDate } from "./igdb";

export type TabNavigationParamList = {
  FindTab: undefined;
  CountdownTab: undefined;
  SettingsTab: undefined;
};

type MovieScreens = {
  Movie: { movieId: MovieDetails["id"]; name: MovieDetails["title"] };
  MovieDiscover: {
    screenTitle: string;
    genre?: MovieDetails["genres"][number];
    company?: MovieDetails["production_companies"][number];
    keyword?: Keywords["keywords"][number];
    provider?: WatchProviders["results"]["US"][
      | "buy"
      | "flatrate"
      | "rent"][number];
  };
  Actor: {
    name: Credits["cast" | "crew"][number]["name"];
    personId: Credits["cast" | "crew"][number]["id"];
  };
  Collection: {
    name: BelongsToCollection["name"];
    collectionId: BelongsToCollection["id"];
  };
};

type GameScreens = {
  Game: { game: Games & { release_dates: ReleaseDate[] } };
  GameDiscover: {
    screenTitle: string;
    genre?: any;
    company?: any;
    keyword?: any;
  };
};

export type FindStackParamList = {
  Find: undefined;
} & MovieScreens &
  GameScreens;

export type CountdownStackParamList = {
  Countdown: undefined;
  SeeAll: {
    sectionType: "Movies" | "Games" | "People";
    title: string;
  };
} & MovieScreens &
  GameScreens;

export type SettingsStackParamList = {
  Settings: undefined;
  Account: undefined;
};
