import { useMMKVDevTools } from "@dev-plugins/react-native-mmkv";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { getAuth } from "@react-native-firebase/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TMDB } from "tmdb-ts";

import { IGDB_AWS_KEY, TMDB_TOKEN } from "@/constants/ApiKeys";
import { useStore } from "@/stores/store";
import { IGDB_API } from "@/types/igdb";

const queryClient = new QueryClient();

export const tmdb = new TMDB(TMDB_TOKEN);

export const igdb = new IGDB_API({
  baseUrl:
    "https://k0o7ncaic1.execute-api.us-east-2.amazonaws.com/production/v4",
  baseApiParams: { headers: { "x-api-key": IGDB_AWS_KEY } },
});

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
    const subscriber = getAuth().onAuthStateChanged((user) => setUser(user));
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
