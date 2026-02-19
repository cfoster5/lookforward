import {
  doc,
  getFirestore,
  updateDoc,
  getDoc,
} from "@react-native-firebase/firestore";
import {
  AuthorizationStatus,
  getMessaging,
  getToken,
  onTokenRefresh,
  requestPermission,
} from "@react-native-firebase/messaging";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import * as Linking from "expo-linking";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import Purchases from "react-native-purchases";

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

    const uid = user.uid;

    let unsubscribe: (() => void) | undefined;

    async function requestUserPermission() {
      const messaging = getMessaging();
      const authStatus = await requestPermission(messaging);
      const enabled =
        authStatus === AuthorizationStatus.AUTHORIZED ||
        authStatus === AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        const db = getFirestore();
        const userRef = doc(db, "users", uid);
        const docSnapshot = await getDoc(userRef);

        if (!docSnapshot.data()?.notifications) {
          await updateDoc(userRef, {
            notifications: { day: true, week: true },
          });
        }

        const token = await getToken(messaging);
        await saveTokenToDatabase(token);
        unsubscribe = onTokenRefresh(messaging, async (token) => {
          await saveTokenToDatabase(token);
        });
      }
    }

    requestUserPermission()
      .catch((error) => {
        console.error("Error in messaging useEffect:", error);
      })
      .finally(() => {
        setInitializing(false);
      });

    async function saveTokenToDatabase(token: string) {
      try {
        const db = getFirestore();
        const userRef = doc(db, "users", uid);
        await updateDoc(userRef, { deviceToken: token });
        await Purchases.setPushToken(token);
      } catch (error) {
        console.error("Error saving token to database:", error);
      }
    }

    requestUserPermission();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
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
