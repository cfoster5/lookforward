import { MMKV } from "react-native-mmkv";
import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";

const storage = new MMKV();

const zustandStorage: StateStorage = {
  setItem: (name, value) => storage.set(name, value),
  getItem: (name) => storage.getString(name) ?? null,
  removeItem: (name) => storage.delete(name),
};

const ONE_HOUR_MS = 60 * 60 * 1000;

interface HistoryItem {
  movieId: string;
  firstSubscribedAt: number;
  unsubscribedAt: number | null;
  isCurrentlySubscribed: boolean;
}

type SubscriptionHistoryState = {
  history: Record<string, HistoryItem>;
};

type SubscriptionHistoryActions = {
  addToHistory: (movieId: string) => void;
  removeFromHistory: (movieId: string) => void;
  getValidHistory: () => HistoryItem[];
  hasValidHistoryFor: (movieId: string) => boolean;
  backfillFromCurrentSubs: (movieIds: string[]) => void;
};

export const useSubscriptionHistoryStore = create<
  SubscriptionHistoryState & SubscriptionHistoryActions
>()(
  persist(
    (set, get) => ({
      history: {},

      addToHistory: (movieId) =>
        set((state) => ({
          history: {
            ...state.history,
            [movieId]: {
              movieId,
              firstSubscribedAt:
                state.history[movieId]?.firstSubscribedAt ?? Date.now(),
              unsubscribedAt: null,
              isCurrentlySubscribed: true,
            },
          },
        })),

      removeFromHistory: (movieId) =>
        set((state) => {
          if (!state.history[movieId]) return state;
          return {
            history: {
              ...state.history,
              [movieId]: {
                ...state.history[movieId],
                isCurrentlySubscribed: false,
                unsubscribedAt: Date.now(),
              },
            },
          };
        }),

      getValidHistory: () => {
        const items = Object.values(get().history);
        return items.filter((item) => {
          if (item.isCurrentlySubscribed) return true;
          if (!item.unsubscribedAt) return false;
          const duration = item.unsubscribedAt - item.firstSubscribedAt;
          return duration >= ONE_HOUR_MS;
        });
      },

      hasValidHistoryFor: (movieId) => {
        const item = get().history[movieId];
        if (!item) return false;
        if (item.isCurrentlySubscribed) return true;
        if (!item.unsubscribedAt) return false;
        const duration = item.unsubscribedAt - item.firstSubscribedAt;
        return duration >= ONE_HOUR_MS;
      },

      // Backfill history from current subscriptions (for existing users)
      // Only adds movies that aren't already in history
      backfillFromCurrentSubs: (movieIds) =>
        set((state) => {
          const now = Date.now();
          const newHistory = { ...state.history };

          for (const movieId of movieIds) {
            // Only backfill if not already in history
            if (!newHistory[movieId]) {
              newHistory[movieId] = {
                movieId,
                firstSubscribedAt: now,
                unsubscribedAt: null,
                isCurrentlySubscribed: true,
              };
            }
          }

          return { history: newHistory };
        }),
    }),
    {
      name: "subscription.history",
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
