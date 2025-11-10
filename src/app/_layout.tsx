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
import * as Linking from "expo-linking";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { HeaderButtonsProvider } from "react-navigation-header-buttons";

import { ExplorePro } from "@/components/ExplorePro";
import { OnboardingModal } from "@/components/OnboardingModal";
import { useFirebaseAnalyticsCheck } from "@/hooks/useFirebaseAnalyticsCheck";
import { useRevenueCat } from "@/hooks/useRevenueCat";
import { AuthStack } from "@/navigation/AuthStack";
import { AppProvider } from "@/providers/app";
import { useAuthStore, useInterfaceStore } from "@/stores";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const { user } = useAuthStore();
  const { theme } = useInterfaceStore();

  useEffect(() => {
    Linking.getInitialURL().then((url) => console.log("Initial URL:", url));
  }, []);

  useFirebaseAnalyticsCheck();

  useRevenueCat();

  useEffect(() => {
    // Check for a valid user before proceeding
    if (!user) {
      setInitializing(false);
      return;
    }

    const uid = user.uid;

    let unsubscribe: (() => void) | undefined;

    async function requestUserPermission() {
      try {
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
            // Only set notification preferences to true if they haven't been set before
            await updateDoc(userRef, {
              notifications: { day: true, week: true },
            });
          }
          const token = await getToken(messaging);
          await saveTokenToDatabase(token);
          // Listen to token refresh changes and store the unsubscribe function
          unsubscribe = onTokenRefresh(messaging, async (token) => {
            await saveTokenToDatabase(token);
          });
        }
      } catch (error) {
        console.error("Error in messaging useEffect:", error);
      } finally {
        setInitializing(false);
      }
    }

    async function saveTokenToDatabase(token: string) {
      try {
        const db = getFirestore();
        const userRef = doc(db, "users", uid);
        await updateDoc(userRef, { deviceToken: token });
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

  if (initializing) return null;

  return (
    <AppProvider>
      <OnboardingModal />
      <ExplorePro />

      {!user ? (
        <AuthStack />
      ) : (
        <HeaderButtonsProvider stackType="native">
          <Slot />
        </HeaderButtonsProvider>
      )}
      {/* Below launches app with the Countdown screen */}
      {/* {user && (
        <HeaderButtonsProvider stackType="native">
          <Slot />
        </HeaderButtonsProvider>
      )} */}
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
    </AppProvider>
  );
}
