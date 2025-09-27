import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { createRef } from "react";
import { ColorSchemeName } from "react-native";
import { create } from "zustand";

const bottomSheetModalRef = createRef<BottomSheetModal>();
const onboardingModalRef = createRef<BottomSheetModal>();
const proModalRef = createRef<BottomSheetModal>();

type InterfaceState = {
  theme: ColorSchemeName;
  bottomSheetModalRef: typeof bottomSheetModalRef;
  onboardingModalRef: typeof onboardingModalRef;
  proModalRef: typeof proModalRef;
  initialSnapPoint: number;
  categoryIndex: number;
};

type InterfaceActions = {
  setTheme: (theme: ColorSchemeName) => void;
  setInitialSnapPoint: (value: number) => void;
  setCategoryIndex: (number: number) => void;
};

export const useInterfaceStore = create<InterfaceState & InterfaceActions>(
  (set) => ({
    theme: "dark",
    setTheme: (theme) => set(() => ({ theme })),
    bottomSheetModalRef,
    onboardingModalRef,
    proModalRef,
    initialSnapPoint: 0,
    setInitialSnapPoint: (value) => set(() => ({ initialSnapPoint: value })),
    categoryIndex: 0,
    setCategoryIndex: (categoryIndex) => set(() => ({ categoryIndex })),
  }),
);
