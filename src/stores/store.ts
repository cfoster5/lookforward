import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import produce from "immer";
import { createRef } from "react";
import { ColorSchemeName } from "react-native";
import { create } from "zustand";

import { Game, ReleaseDate } from "@/types";

const bottomSheetModalRef = createRef<BottomSheetModal>();
const onboardingModalRef = createRef<BottomSheetModal>();

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
  bottomSheetModalRef: typeof bottomSheetModalRef;
  onboardingModalRef: typeof onboardingModalRef;
  updateSubs: (
    key: Subs,
    documentId: FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData>["id"]
  ) => void;
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
  bottomSheetModalRef,
  onboardingModalRef,
  updateSubs: (key, documentId) =>
    set(
      produce((draft) => {
        const foundSub = draft[key].find(
          (sub) => sub.documentID === documentId
        );
        foundSub.isSelected = !foundSub.isSelected || false;
      })
    ),
}));
