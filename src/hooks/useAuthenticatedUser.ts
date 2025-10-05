import { FirebaseAuthTypes } from "@react-native-firebase/auth";

import { useAuthStore } from "@/stores";

/**
 * Hook for authenticated contexts where user must be non-null.
 * This provides TypeScript type narrowing so we don't need ! assertions.
 */

export const useAuthenticatedUser = (): FirebaseAuthTypes.User => {
  const { user } = useAuthStore();
  if (!user) throw new Error("User not authenticated");
  return user;
};
