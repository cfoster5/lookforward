import { isLiquidGlassAvailable } from "expo-glass-effect";
import * as Linking from "expo-linking";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

import { AppProvider } from "@/providers/app";
import { useAuthStore, useInterfaceStore } from "@/stores";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { theme } = useInterfaceStore();

  return (
    <AppProvider>
      <RootLayoutContent />
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
    </AppProvider>
  );
}

function RootLayoutContent() {
  const [initializing, setInitializing] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    Linking.getInitialURL().then((url) => console.log("Initial URL:", url));
  }, []);

  useEffect(() => {
    if (!user) return;
    setInitializing(false);
  }, [user]);

  useEffect(() => {
    if (!initializing) SplashScreen.hideAsync().catch(console.warn);
  }, [initializing]);

  // Keep splash screen visible until user is authenticated (anonymous or real)
  if (initializing) return null;

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="interest-selection"
        options={{ headerShown: false, animation: "none" }}
      />
      <Stack.Screen
        name="watch-providers"
        options={{ headerShown: false, animation: "none" }}
      />
      <Stack.Screen
        name="game-platforms"
        options={{ headerShown: false, animation: "none" }}
      />
      <Stack.Screen
        name="commitment"
        options={{
          title: "Commitment",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="onboarding"
        options={{ headerShown: false, animation: "none" }}
      />
    </Stack>
  );
}
