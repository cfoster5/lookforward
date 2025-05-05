import firestore from "@react-native-firebase/firestore";
import messaging from "@react-native-firebase/messaging";
import * as Linking from "expo-linking";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import mobileAds from "react-native-google-mobile-ads";
import { HeaderButtonsProvider } from "react-navigation-header-buttons";

import { ExplorePro } from "@/components/ExplorePro";
import { OnboardingModal } from "@/components/OnboardingModal";
import { useFirebaseAnalyticsCheck } from "@/hooks/useFirebaseAnalyticsCheck";
import { useRevenueCat } from "@/hooks/useRevenueCat";
import { AuthStack } from "@/navigation/AuthStack";
import { AppProvider } from "@/providers/app";
import { useStore } from "@/stores/store";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const { user, isPro, theme } = useStore();

  useEffect(() => {
    Linking.getInitialURL().then((url) => console.log("Initial URL:", url));
  }, []);

  useFirebaseAnalyticsCheck();

  // Initialize Google Mobile Ads SDK
  useEffect(() => {
    if (!isPro) mobileAds().initialize();
  }, [isPro]);

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
      <OnboardingModal />
      <ExplorePro />
      {!user ? (
        <AuthStack />
      ) : (
        <HeaderButtonsProvider stackType="native">
          <Slot />
        </HeaderButtonsProvider>
      )}
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
    </AppProvider>
  );
}
