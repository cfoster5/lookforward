import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type CountdownState = {
  movies: string[];
  games: string[];
  isEditing: boolean;
};

type CountdownActions = {
  toggleSelection: (documentId: string, section: "movies" | "games") => void;
  clearSelections: () => void;
  toggleIsEditing: () => void;
};

export const useCountdownStore = create<CountdownState & CountdownActions>()(
  immer((set) => ({
    movies: [],
    games: [],
    toggleSelection: (documentId: string, section) =>
      set((state) => {
        const index = state[section].findIndex(
          (selection) => selection === documentId,
        );
        if (index !== -1) state[section].splice(index, 1);
        else state[section].push(documentId);
      }),
    clearSelections: () =>
      set((state) => {
        state.movies = [];
        state.games = [];
      }),
    isEditing: false,
    toggleIsEditing: () =>
      set((state) => {
        state.isEditing = !state.isEditing;
      }),
  })),
);
