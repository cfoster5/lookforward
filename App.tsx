import firestore from "@react-native-firebase/firestore";
import messaging from "@react-native-firebase/messaging";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { StatusBar } from "react-native";
import mobileAds from "react-native-google-mobile-ads";

import { useFirebaseAnalyticsCheck } from "@/hooks/useFirebaseAnalyticsCheck";
import { useRevenueCat } from "@/hooks/useRevenueCat";

import Navigation from "./src/navigation";
import { AppProvider } from "./src/providers/app";
import { useStore } from "./src/stores/store";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function App() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const { user, isPro, setIsPro, theme } = useStore();

  useFirebaseAnalyticsCheck();

  // Initialize Google Mobile Ads SDK
  useEffect(() => {
    if (!isPro) mobileAds().initialize();
  }, [isPro]);

  useRevenueCat(user, setIsPro);

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
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (enabled) {
          const userRef = firestore().collection("users").doc(uid);
          const docSnapshot = await userRef.get();
          if (!docSnapshot.data()?.notifications) {
            // Only set notification preferences to true if they haven't been set before
            await userRef.update({ notifications: { day: true, week: true } });
          }
          const token = await messaging().getToken();
          await saveTokenToDatabase(token);
          // Listen to token refresh changes and store the unsubscribe function
          unsubscribe = messaging().onTokenRefresh(async (token) => {
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
        await firestore()
          .collection("users")
          .doc(uid)
          .update({ deviceToken: token });
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
