import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { createRef } from "react";
import { ColorSchemeName } from "react-native";
import { create } from "zustand";

import { MovieOption } from "@/screens/Search/types";

const bottomSheetModalRef = createRef<BottomSheetModal>();
const onboardingModalRef = createRef<BottomSheetModal>();
const proModalRef = createRef<BottomSheetModal>();
const movieSearchModalRef = createRef<BottomSheetModal>();

type InterfaceState = {
  theme: ColorSchemeName;
  bottomSheetModalRef: typeof bottomSheetModalRef;
  onboardingModalRef: typeof onboardingModalRef;
  proModalRef: typeof proModalRef;
  movieSearchModalRef: typeof movieSearchModalRef;
  movieSearchOption: MovieOption;
  categoryIndex: number;
};

type InterfaceActions = {
  setTheme: (theme: ColorSchemeName) => void;
  setCategoryIndex: (number: number) => void;
  setMovieSearchOption: (option: MovieOption) => void;
};

export const useInterfaceStore = create<InterfaceState & InterfaceActions>(
  (set) => ({
    theme: "dark",
    setTheme: (theme) => set(() => ({ theme })),
    bottomSheetModalRef,
    onboardingModalRef,
    proModalRef,
    movieSearchModalRef,
    movieSearchOption: MovieOption.ComingSoon,
    setMovieSearchOption: (option) =>
      set(() => ({ movieSearchOption: option })),
    categoryIndex: 0,
    setCategoryIndex: (categoryIndex) => set(() => ({ categoryIndex })),
  }),
);
