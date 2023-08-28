import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { createRef } from "react";
import { ColorSchemeName } from "react-native";
import { create } from "zustand";

import { Game, ReleaseDate } from "@/types";

const bottomSheetModalRef = createRef<BottomSheetModal>();
const onboardingModalRef = createRef<BottomSheetModal>();
const proModalRef = createRef<BottomSheetModal>();

export enum Subs {
  movieSubs = "movieSubs",
  gameSubs = "gameSubs",
}

type Store = {
  user: FirebaseAuthTypes.User | null;
  setUser: (user: FirebaseAuthTypes.User | null) => void;
  theme: ColorSchemeName;
  setTheme: (theme: ColorSchemeName) => void;
  // I think below type is correct but needs validation
  game: Game & {
    release_dates: ReleaseDate[];
  };
  setGame: (
    game: Game & {
      release_dates: ReleaseDate[];
    }
  ) => void;
  movieSubs: any;
  setMovieSubs: (movies: any) => void;
  gameSubs: any;
  setGameSubs: (games: any) => void;
  categoryIndex: number;
  setCategoryIndex: (number: Store["categoryIndex"]) => void;
  bottomSheetModalRef: typeof bottomSheetModalRef;
  onboardingModalRef: typeof onboardingModalRef;
  proModalRef: typeof proModalRef;
  isPro: boolean;
  setIsPro: (isPro: Store["isPro"]) => void;
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
  categoryIndex: 0,
  setCategoryIndex: (categoryIndex) => set(() => ({ categoryIndex })),
  bottomSheetModalRef,
  onboardingModalRef,
  proModalRef,
  isPro: false,
  setIsPro: (isPro) => set(() => ({ isPro })),
}));
