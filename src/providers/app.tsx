import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import React, { createContext, useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "react-query";

import { useStore } from "@/stores/store";

const queryClient = new QueryClient();

type AppProviderProps = {
  children: React.ReactNode;
};

export const AuthProviderContext = createContext<{
  user: FirebaseAuthTypes.User | null;
}>({
  user: null,
});

export function AppProvider({ children }: AppProviderProps) {
  // const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const { user, setUser } = useStore();

  // useEffect(() => {
  //   const unsubscribe = auth().onAuthStateChanged((user) => setUser(user));
  //   return unsubscribe; // unsubscribe on unmount
  // });

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user) => setUser(user));
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* <AuthProviderContext.Provider value={{ user }}> */}
      <SafeAreaProvider>{children}</SafeAreaProvider>
      {/* </AuthProviderContext.Provider> */}
    </QueryClientProvider>
  );
}
