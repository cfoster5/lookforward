import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { ColorSchemeName } from "react-native";
import { create } from "zustand";

type Store = {
  user: FirebaseAuthTypes.User | null;
  setUser: (user: FirebaseAuthTypes.User | null) => void;
  theme: ColorSchemeName;
  setTheme: (theme: ColorSchemeName) => void;
  game: any;
  setGame: (game: any) => void;
  movieSubs: any;
  setMovieSubs: (movies: any) => void;
  gameSubs: any;
  setGameSubs: (games: any) => void;
};

export const useStore = create<Store>((set) => ({
  user: null,
  setUser: (user) => set(() => ({ user })),
  theme: "dark",
  setTheme: (theme) => set(() => ({ theme })),
  game: null,
  setGame: (game) => set(() => ({ game })),
  movieSubs: [],
  setMovieSubs: (movieSubs) => set(() => ({ movieSubs })),
  gameSubs: [],
  setGameSubs: (gameSubs) => set(() => ({ gameSubs })),
}));
