import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";
import { create } from "zustand";
import { Recent } from "@/types";

const storage = new MMKV();

const zustandStorage: StateStorage = {
  setItem: (name, value) => storage.set(name, value),
  getItem: (name) => storage.getString(name) ?? null,
  removeItem: (name) => storage.delete(name),
};

type RecentItemsState = {
  recentMovies: Recent[];
  recentPeople: Recent[];
  recentGames: Recent[];
};

type RecentKey = "recentMovies" | "recentPeople" | "recentGames";

type RecentItemsActions = {
  resetItems: (key: RecentKey) => void;
  addRecent: (key: RecentKey, recent: Recent) => void;
};

export const useRecentMoviesStore = create<
  RecentItemsState & RecentItemsActions
>()(
  persist(
    (set) => ({
      recentMovies: [],
      recentPeople: [],
      recentGames: [],
      resetItems: (key) => {
        set(() => ({
          [key]: [],
        }));
      },
      addRecent: (key, recent) =>
        set((state) => {
          const index = state[key].findIndex((item) => item.id === recent.id);
          const newState = [...state[key]];
          if (index === -1) newState.unshift(recent);
          else if (index !== 0) {
            // No action if item is already at beginning
            newState.splice(index, 1);
            newState.unshift(recent);
          }
          return { [key]: newState };
        }),
    }),
    {
      name: "recent.items",
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
