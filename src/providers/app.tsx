import { useMMKVDevTools } from "@dev-plugins/react-native-mmkv";
import { useReactNavigationDevTools } from "@dev-plugins/react-navigation";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
} from "@react-native-firebase/auth";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useNavigationContainerRef } from "expo-router";
import { PostHogProvider } from "posthog-react-native";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TMDB } from "tmdb-ts";

import { IGDB_AWS_KEY, TMDB_TOKEN } from "@/constants/ApiKeys";
import { useAuthStore, useInterfaceStore } from "@/stores";
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
  const { setUser } = useAuthStore();
  const { theme } = useInterfaceStore();
  const navigationRef = useNavigationContainerRef();
  useReactNavigationDevTools(navigationRef);
  useReactQueryDevTools(queryClient);
  useMMKVDevTools();
  // TODO: allow switching appearance
  // const colorScheme = useColorScheme();

  useEffect(() => {
    const auth = getAuth();
    const subscriber = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // Automatically sign in as guest if not already signed in
        try {
          await signInAnonymously(auth);
        } catch (error) {
          console.error("Error signing in anonymously:", error);
        }
      } else {
        setUser(user);
      }
    });
    return subscriber; // unsubscribe on unmount
  }, [setUser]);

  return (
    <PostHogProvider
      apiKey="phc_diTHFV13CPZdclusrkGwC0v8beszFxK3k1cLTUcg2PH"
      options={{
        host: "https://us.i.posthog.com",
      }}
      autocapture={{
        captureScreens: false, // Screen events are handled differently for v7 and higher
        captureTouches: true,
      }}
    >
      <GestureHandlerRootView>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider
            // value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            value={theme === "dark" ? DarkTheme : DefaultTheme}
          >
            <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </GestureHandlerRootView>
    </PostHogProvider>
  );
}
