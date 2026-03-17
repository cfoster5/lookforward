import {
  getInitialNotification,
  getMessaging,
  onNotificationOpenedApp,
} from "@react-native-firebase/messaging";
import * as Linking from "expo-linking";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";

import { AppProvider } from "@/providers/app";
import { useAuthStore } from "@/stores/auth";
import { useInterfaceStore } from "@/stores/interface";
import { navigateFromNotification } from "@/utils/notificationNavigation";
import { tryRequestReviewFromNotification } from "@/utils/requestReview";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const theme = useInterfaceStore((s) => s.theme);

  return (
    <AppProvider>
      <RootLayoutContent />
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
    </AppProvider>
  );
}

function RootLayoutContent() {
  const [initializing, setInitializing] = useState(true);
  const user = useAuthStore((s) => s.user);
  const handledMessageIds = useRef(new Set<string>());

  useEffect(() => {
    Linking.getInitialURL().then((url) => console.log("Initial URL:", url));
  }, []);

  useEffect(() => {
    if (!user) return;
    setInitializing(false);
  }, [user]);

  useEffect(() => {
    if (initializing) return;

    const messaging = getMessaging();

    const handleNotificationOpen = (
      remoteMessage: Awaited<ReturnType<typeof getInitialNotification>>,
    ) => {
      const messageId = remoteMessage?.messageId;
      if (messageId && handledMessageIds.current.has(messageId)) return;

      const navigated = navigateFromNotification(remoteMessage);
      if (navigated && messageId) {
        handledMessageIds.current.add(messageId);
        tryRequestReviewFromNotification();
      }
    };

    getInitialNotification(messaging)
      .then(handleNotificationOpen)
      .catch(console.warn);

    return onNotificationOpenedApp(messaging, handleNotificationOpen);
  }, [initializing]);

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
