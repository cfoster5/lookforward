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
  hasSeenOnboardingModal: boolean;
  requestNonPersonalizedAdsOnly: boolean;
};

type AppConfigActions = {
  setHasRequestedReview: () => void;
  setHasSeenOnboardingModal: () => void;
  setRequestNonPersonalizedAdsOnly: (
    requestNonPersonalizedAdsOnly: boolean,
  ) => void;
};

export const useAppConfigStore = create<AppConfigState & AppConfigActions>()(
  persist(
    (set) => ({
      hasRequestedReview: false,
      lastRequestedReviewTimestamp: 0,
      hasSeenOnboardingModal: false,
      requestNonPersonalizedAdsOnly: true,
      setHasRequestedReview: () =>
        set(() => ({
          hasRequestedReview: true,
          lastRequestedReviewTimestamp: timestamp,
        })),
      setHasSeenOnboardingModal: () =>
        set(() => ({
          hasSeenOnboardingModal: true,
        })),
      setRequestNonPersonalizedAdsOnly: (
        requestNonPersonalizedAdsOnly: boolean,
      ) =>
        set(() => ({
          requestNonPersonalizedAdsOnly,
        })),
    }),
    {
      name: "app.config",
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
