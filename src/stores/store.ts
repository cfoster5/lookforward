import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import * as Haptics from "expo-haptics";
import { createRef } from "react";
import { ColorSchemeName } from "react-native";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { FirestoreGame, FirestoreMovie } from "@/interfaces/firebase";

const bottomSheetModalRef = createRef<BottomSheetModal>();
const onboardingModalRef = createRef<BottomSheetModal>();
const proModalRef = createRef<BottomSheetModal>();

type State = {
  user: FirebaseAuthTypes.User | null;
  theme: ColorSchemeName;
  movieSubs: FirestoreMovie[];
  gameSubs: FirestoreGame[];
  categoryIndex: number;
  bottomSheetModalRef: typeof bottomSheetModalRef;
  onboardingModalRef: typeof onboardingModalRef;
  proModalRef: typeof proModalRef;
  isPro: boolean;
  initialSnapPoint: number;
};

type Actions = {
  setUser: (user: FirebaseAuthTypes.User | null) => void;
  setTheme: (theme: ColorSchemeName) => void;
  setMovieSubs: (movies: FirestoreMovie[]) => void;
  setGameSubs: (games: FirestoreGame[]) => void;
  setCategoryIndex: (number: number) => void;
  setIsPro: (isPro: boolean) => void;
  setInitialSnapPoint: (value: number) => void;
};

export const useStore = create<State & Actions>((set) => ({
  user: null,
  setUser: (user) => set(() => ({ user })),
  theme: "dark",
  setTheme: (theme) => set(() => ({ theme })),
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
  setIsPro: (isPro) => set(() => ({ isPro: true })),
  initialSnapPoint: 0,
  setInitialSnapPoint: (value) => set(() => ({ initialSnapPoint: value })),
}));

type CountdownState = {
  movies: string[];
  games: string[];
  showDeleteButton: boolean;
};

type CountdownActions = {
  toggleSelection: (documentId: string, section: "movies" | "games") => void;
  clearSelections: () => void;
  toggleDeleteButton: () => void;
};

export const useCountdownStore = create<CountdownState & CountdownActions>()(
  immer((set) => ({
    movies: [],
    games: [],
    toggleSelection: (documentId: string, section) =>
      set((state) => {
        const index = state[section].findIndex(
          (selection) => selection === documentId,
        );
        if (index !== -1) state[section].splice(index, 1);
        else state[section].push(documentId);
        Haptics.selectionAsync();
      }),
    clearSelections: () =>
      set((state) => {
        state.movies = [];
        state.games = [];
      }),
    showDeleteButton: false,
    toggleDeleteButton: () =>
      set((state) => {
        state.showDeleteButton = !state.showDeleteButton;
      }),
  })),
);
