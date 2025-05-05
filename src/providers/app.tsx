import { useMMKVDevTools } from "@dev-plugins/react-native-mmkv";
import { useReactNavigationDevTools } from "@dev-plugins/react-navigation";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import auth from "@react-native-firebase/auth";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useNavigationContainerRef } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
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
  const { setUser, theme } = useStore();
  const navigationRef = useNavigationContainerRef();
  useReactNavigationDevTools(navigationRef);
  useReactQueryDevTools(queryClient);
  useMMKVDevTools();

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user) => setUser(user));
    return subscriber; // unsubscribe on unmount
  }, [setUser]);

  return (
    <GestureHandlerRootView>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={theme === "dark" ? DarkTheme : DefaultTheme}>
          <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
