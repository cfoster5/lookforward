import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type CountdownState = {
  movies: string[];
  games: string[];
  people: string[];
  isEditing: boolean;
};

type CountdownActions = {
  toggleSelection: (
    documentId: string,
    section: "movies" | "games" | "people",
  ) => void;
  clearSelections: () => void;
  toggleIsEditing: () => void;
};

export const useCountdownStore = create<CountdownState & CountdownActions>()(
  immer((set) => ({
    movies: [],
    games: [],
    people: [],
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
        state.people = [];
      }),
    isEditing: false,
    toggleIsEditing: () =>
      set((state) => {
        state.isEditing = !state.isEditing;
      }),
  })),
);
