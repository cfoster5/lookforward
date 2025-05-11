import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
} from "@react-native-firebase/firestore";
import {
  getMessaging,
  AuthorizationStatus,
} from "@react-native-firebase/messaging";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { StatusBar } from "react-native";

import { useFirebaseAnalyticsCheck } from "@/hooks/useFirebaseAnalyticsCheck";
import useGoogleMobileAds from "@/hooks/useGoogleMobileAds";
import { useRevenueCat } from "@/hooks/useRevenueCat";

import Navigation from "./src/navigation";
import { AppProvider } from "./src/providers/app";
import { useStore } from "./src/stores/store";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function App() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const { user, theme } = useStore();

  useFirebaseAnalyticsCheck();
  useGoogleMobileAds();
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
        const authStatus = await getMessaging().requestPermission();
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
          const token = await getMessaging().getToken();
          await saveTokenToDatabase(token);
          // Listen to token refresh changes and store the unsubscribe function
          unsubscribe = getMessaging().onTokenRefresh(async (token) => {
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
      <Navigation />
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
      />
    </AppProvider>
  );
}
