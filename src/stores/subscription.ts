import { create } from "zustand";

import { FirestoreGame, FirestoreMovie } from "@/interfaces/firebase";

// Free tier limit: max 5 total countdowns (movies + games combined)
export const FREE_TIER_COUNTDOWN_LIMIT = 5;

type SubscriptionState = {
  movieSubs: FirestoreMovie[];
  gameSubs: FirestoreGame[];
};

type SubscriptionActions = {
  setMovieSubs: (movies: FirestoreMovie[]) => void;
  setGameSubs: (games: FirestoreGame[]) => void;
  hasReachedLimit: (isPro: boolean) => boolean;
};

export const useSubscriptionStore = create<
  SubscriptionState & SubscriptionActions
>((set, get) => ({
  movieSubs: [],
  setMovieSubs: (movieSubs) => set(() => ({ movieSubs })),
  gameSubs: [],
  setGameSubs: (gameSubs) => set(() => ({ gameSubs })),
  hasReachedLimit: (isPro: boolean) => {
    if (isPro) return false;
    const { movieSubs, gameSubs } = get();
    return movieSubs.length + gameSubs.length >= FREE_TIER_COUNTDOWN_LIMIT;
  },
}));
