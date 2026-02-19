import { MMKV } from "react-native-mmkv";
import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";

import { timestamp } from "@/utils/dates";

const storage = new MMKV();

const zustandStorage: StateStorage = {
  setItem: (name, value) => storage.set(name, value),
  getItem: (name) => storage.getString(name) ?? null,
  removeItem: (name) => storage.delete(name),
};

type AppConfigState = {
  hasRequestedReview: boolean;
  lastRequestedReviewTimestamp: number;
  hasCompletedCommitment: boolean;
  hasSeenOnboardingModal: boolean;
  movieRegion: string;
  movieLanguage: string;
  searchCount: number;
};

type AppConfigActions = {
  setHasRequestedReview: () => void;
  completeCommitment: () => void;
  setHasSeenOnboardingModal: () => void;
  setMovieRegion: (region: string) => void;
  setMovieLanguage: (language: string) => void;
  incrementSearchCount: () => void;
};

export const useAppConfigStore = create<AppConfigState & AppConfigActions>()(
  persist(
    (set) => ({
      hasRequestedReview: false,
      lastRequestedReviewTimestamp: 0,
      hasCompletedCommitment: false,
      hasSeenOnboardingModal: false,
      movieRegion: "US",
      movieLanguage: "en",
      searchCount: 0,
      setHasRequestedReview: () =>
        set(() => ({
          hasRequestedReview: true,
          lastRequestedReviewTimestamp: timestamp,
        })),
      completeCommitment: () =>
        set(() => ({
          hasCompletedCommitment: true,
        })),
      setHasSeenOnboardingModal: () =>
        set(() => ({
          hasSeenOnboardingModal: true,
        })),
      setMovieRegion: (region) =>
        set(() => ({
          movieRegion: region,
        })),
      setMovieLanguage: (language) =>
        set(() => ({
          movieLanguage: language,
        })),
      incrementSearchCount: () =>
        set((state) => ({
          searchCount: state.searchCount + 1,
        })),
    }),
    {
      name: "app.config",
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
