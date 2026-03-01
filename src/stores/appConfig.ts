import { MMKV } from "react-native-mmkv";
import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";

import { useOnboardingDraft } from "@/stores/onboardingDraft";

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
  hasCompletedInterestSelection: boolean;
  selectedInterests: ("movies" | "games")[];
  selectedWatchProviders: number[];
  selectedGamePlatforms: number[];
  movieRegion: string;
  movieLanguage: string;
  searchCount: number;
};

type AppConfigActions = {
  setHasRequestedReview: () => void;
  completeCommitment: () => void;
  completeInterestSelection: (data: {
    interests: ("movies" | "games")[];
    watchProviders: number[];
    gamePlatforms: number[];
  }) => void;
  setHasSeenOnboardingModal: () => void;
  resetOnboardingFlow: () => void;
  setMovieRegion: (region: string) => void;
  setMovieLanguage: (language: string) => void;
  incrementSearchCount: () => void;
};

export const useAppConfigStore = create<AppConfigState & AppConfigActions>()(
  persist(
    (set, get) => ({
      hasRequestedReview: false,
      lastRequestedReviewTimestamp: 0,
      hasCompletedCommitment: false,
      hasSeenOnboardingModal: false,
      hasCompletedInterestSelection: false,
      selectedInterests: [],
      selectedWatchProviders: [],
      selectedGamePlatforms: [],
      movieRegion: "US",
      movieLanguage: "en",
      searchCount: 0,
      setHasRequestedReview: () =>
        set(() => ({
          hasRequestedReview: true,
          lastRequestedReviewTimestamp: Date.now(),
        })),
      completeCommitment: () =>
        set(() => ({
          hasCompletedCommitment: true,
        })),
      completeInterestSelection: (data) =>
        set(() => ({
          hasCompletedInterestSelection: true,
          selectedInterests: data.interests,
          selectedWatchProviders: data.interests.includes("movies")
            ? data.watchProviders
            : [],
          selectedGamePlatforms: data.interests.includes("games")
            ? data.gamePlatforms
            : [],
        })),
      setHasSeenOnboardingModal: () =>
        set(() => ({
          hasSeenOnboardingModal: true,
        })),
      resetOnboardingFlow: () => {
        const current = get();
        useOnboardingDraft.setState({
          interests: [...current.selectedInterests],
          watchProviders: current.selectedWatchProviders.map((id) =>
            id === 119 ? 9 : id,
          ),
          gamePlatforms: [...current.selectedGamePlatforms],
        });
        set(() => ({
          hasCompletedCommitment: false,
          hasSeenOnboardingModal: false,
          hasCompletedInterestSelection: false,
          selectedInterests: [],
          selectedWatchProviders: [],
          selectedGamePlatforms: [],
        }));
      },
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
      version: 2,
      migrate: (persistedState, version) => {
        const state = persistedState as Partial<
          AppConfigState & AppConfigActions
        >;
        if (state.hasCompletedCommitment === undefined) {
          state.hasCompletedCommitment = true;
        }
        if (version < 2) {
          state.hasCompletedInterestSelection = true;
          state.selectedInterests = [];
          state.selectedWatchProviders = [];
          state.selectedGamePlatforms = [];
        }
        return state as AppConfigState & AppConfigActions;
      },
    },
  ),
);
