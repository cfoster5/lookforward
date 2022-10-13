import { NavigatorScreenParams } from "@react-navigation/native";

export type AuthStackParams = {
  Welcome: undefined;
  "Create Account": undefined;
  "Sign In": { emailSent: boolean; email: string } | undefined;
  "Password Reset": undefined;
};

export type BottomTabParams = {
  FindTabStack: NavigatorScreenParams<FindStackParams>;
  CountdownTabStack: NavigatorScreenParams<CountdownStackParams>;
  SettingsTabStack: NavigatorScreenParams<SettingsStackParams>;
};

export type FindStackParams = {
  Find: undefined;
  Movie: { movieId: any; movieTitle: string };
  Game: { game: any };
  MovieDiscover: { genre: any; company: any; keyword: any; provider: any };
  GameDiscover: { genre: any };
  Actor: { personId: any };
  Collection: { collectionId: any };
  // Movie: { ids: AnticipatedMovie["movie"]["ids"] };
};

export type CountdownStackParams = {
  Countdown: undefined;
  Movie: { movieId: any; movieTitle: string };
  MovieDiscover: { genre: any; company: any; keyword: any; provider: any };
  Actor: { personId: any };
  Collection: { collectionId: any };
  // Movie: { ids: AnticipatedMovie["movie"]["ids"] };
};

export type SettingsStackParams = {
  Settings: undefined;
  Account: undefined;
};
