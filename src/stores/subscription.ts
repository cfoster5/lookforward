import { create } from "zustand";

import { FirestoreGame, FirestoreMovie } from "@/interfaces/firebase";

type SubscriptionState = {
  movieSubs: FirestoreMovie[];
  gameSubs: FirestoreGame[];
};

type SubscriptionActions = {
  setMovieSubs: (movies: FirestoreMovie[]) => void;
  setGameSubs: (games: FirestoreGame[]) => void;
};

export const useSubscriptionStore = create<
  SubscriptionState & SubscriptionActions
>((set) => ({
  movieSubs: [],
  setMovieSubs: (movieSubs) => set(() => ({ movieSubs })),
  gameSubs: [],
  setGameSubs: (gameSubs) => set(() => ({ gameSubs })),
}));
