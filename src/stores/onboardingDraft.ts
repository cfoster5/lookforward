import { create } from "zustand";

type OnboardingDraft = {
  interests: ("movies" | "games")[];
  watchProviders: number[];
  gamePlatforms: number[];
  toggleInterest: (interest: "movies" | "games") => void;
  toggleWatchProvider: (id: number) => void;
  toggleGamePlatform: (id: number) => void;
  reset: () => void;
};

export const useOnboardingDraft = create<OnboardingDraft>((set) => ({
  interests: ["movies", "games"],
  watchProviders: [],
  gamePlatforms: [],

  toggleInterest: (interest) =>
    set((state) => {
      const has = state.interests.includes(interest);
      if (has) {
        return {
          interests: state.interests.filter((i) => i !== interest),
          watchProviders: interest === "movies" ? [] : state.watchProviders,
          gamePlatforms: interest === "games" ? [] : state.gamePlatforms,
        };
      }
      return { interests: [...state.interests, interest] };
    }),

  toggleWatchProvider: (id) =>
    set((state) => ({
      watchProviders: state.watchProviders.includes(id)
        ? state.watchProviders.filter((p) => p !== id)
        : [...state.watchProviders, id],
    })),

  toggleGamePlatform: (id) =>
    set((state) => ({
      gamePlatforms: state.gamePlatforms.includes(id)
        ? state.gamePlatforms.filter((p) => p !== id)
        : [...state.gamePlatforms, id],
    })),

  reset: () =>
    set(() => ({ interests: [], watchProviders: [], gamePlatforms: [] })),
}));
