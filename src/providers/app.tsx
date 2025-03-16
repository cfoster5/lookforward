import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import auth from "@react-native-firebase/auth";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "react-query";
import { TMDB } from "tmdb-ts";

import { TMDB_TOKEN } from "@/constants/ApiKeys";
import { useStore } from "@/stores/store";
import { useMMKVDevTools } from "@dev-plugins/react-native-mmkv";

const queryClient = new QueryClient();

export const tmdb = new TMDB(TMDB_TOKEN);

type AppProviderProps = {
  children: React.ReactNode;
};

export function AppProvider({ children }: AppProviderProps) {
  // const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const { setUser } = useStore();
  useReactQueryDevTools(queryClient);
  useMMKVDevTools();

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
        <SafeAreaProvider>
          <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
