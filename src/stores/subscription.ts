import { create } from "zustand";

import {
  FirestoreGame,
  FirestoreMovie,
  FirestorePerson,
} from "@/interfaces/firebase";

// Free tier limit: max 3 total countdowns (movies + games combined)
export const FREE_TIER_COUNTDOWN_LIMIT = 3;

type SubscriptionState = {
  movieSubs: FirestoreMovie[];
  gameSubs: FirestoreGame[];
  personSubs: FirestorePerson[];
};

type SubscriptionActions = {
  setMovieSubs: (movies: FirestoreMovie[]) => void;
  setGameSubs: (games: FirestoreGame[]) => void;
  setPersonSubs: (people: FirestorePerson[]) => void;
  hasReachedLimit: (isPro: boolean) => boolean;
};

export const useSubscriptionStore = create<
  SubscriptionState & SubscriptionActions
>((set, get) => ({
  movieSubs: [],
  setMovieSubs: (movieSubs) => set(() => ({ movieSubs })),
  gameSubs: [],
  setGameSubs: (gameSubs) => set(() => ({ gameSubs })),
  personSubs: [],
  setPersonSubs: (personSubs) => set(() => ({ personSubs })),
  hasReachedLimit: (isPro: boolean) => {
    if (isPro) return false;
    const { movieSubs, gameSubs } = get();
    return movieSubs.length + gameSubs.length >= FREE_TIER_COUNTDOWN_LIMIT;
  },
}));
