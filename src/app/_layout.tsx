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
        name="commitment"
        options={{
          title: "Commitment",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="onboarding"
        options={{
          headerShown: true,
          headerTransparent: Platform.OS === "ios",
          headerLargeTitle: false,
          title: "Getting Started",
          presentation: "formSheet",
          // sheetGrabberVisible: true,
          sheetAllowedDetents: "fitToContents",
          contentStyle: {
            backgroundColor:
              Platform.OS === "ios" && isLiquidGlassAvailable()
                ? "transparent"
                : "#F2F2F7",
          },
          headerStyle: {
            backgroundColor: Platform.OS === "ios" ? "transparent" : "#F2F2F7",
          },
          headerBlurEffect:
            Platform.OS === "ios" && isLiquidGlassAvailable()
              ? undefined
              : "light",
        }}
      />
    </Stack>
  );
}
