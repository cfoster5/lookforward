import { FirebaseAuthTypes } from "@react-native-firebase/auth";

import { useAuthStore } from "@/stores/auth";

/**
 * Hook for authenticated contexts where user must be non-null.
 * This provides TypeScript type narrowing so we don't need ! assertions.
 */

export const useAuthenticatedUser = (): FirebaseAuthTypes.User => {
  const user = useAuthStore((s) => s.user);
  if (!user) throw new Error("User not authenticated");
  return user;
};
