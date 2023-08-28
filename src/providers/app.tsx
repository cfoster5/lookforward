import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { createContext, useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
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
  }, [setUser]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        {/* <AuthProviderContext.Provider value={{ user }}> */}
        <SafeAreaProvider>
          <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
        </SafeAreaProvider>
        {/* </AuthProviderContext.Provider> */}
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
