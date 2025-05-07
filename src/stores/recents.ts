import { MMKV } from "react-native-mmkv";
import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";

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
  removeRecent: (key: RecentKey, recent: Recent) => void;
};

export const useRecentItemsStore = create<
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
          const currentList = state[key];
          const index = currentList.findIndex(
            // Convert the id to a number
            // id is a string when coming from a deep link
            (item) => Number(item.id) === Number(recent.id),
          );
          // If the item is already at the beginning, no changes are needed
          if (index === 0) return state;

          // Create a new array only if changes are needed
          const newState =
            index === -1
              ? [recent, ...currentList]
              : [
                  recent,
                  ...currentList.slice(0, index),
                  ...currentList.slice(index + 1),
                ];

          return { [key]: newState };
        }),
      removeRecent: (key, recent) =>
        set((state) => {
          const currentList = state[key];
          const index = currentList.findIndex((item) => item.id === recent.id);
          if (index === -1) return state;
          const newState = [
            ...currentList.slice(0, index),
            ...currentList.slice(index + 1),
          ];

          return { [key]: newState };
        }),
    }),
    {
      name: "recent.items",
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
