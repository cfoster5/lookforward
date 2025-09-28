import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { create } from "zustand";

type AuthState = {
  user: FirebaseAuthTypes.User | null;
  isPro: boolean;
};

type AuthActions = {
  setUser: (user: FirebaseAuthTypes.User | null) => void;
  setIsPro: (isPro: boolean) => void;
};

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: null,
  setUser: (user) => set(() => ({ user })),
  isPro: true,
  setIsPro: (isPro) => set(() => ({ isPro: true })),
}));
