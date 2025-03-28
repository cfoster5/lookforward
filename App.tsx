import firestore from "@react-native-firebase/firestore";
import messaging from "@react-native-firebase/messaging";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { StatusBar } from "react-native";
import Purchases from "react-native-purchases";

import Navigation from "./src/navigation";
import { AppProvider } from "./src/providers/app";
import { useStore } from "./src/stores/store";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function App() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const { user, setIsPro } = useStore();
  const [colorScheme] = useState("dark");

  useEffect(() => {
    /* Enable debug logs before calling `setup`. */
    Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);

    /*
      Initialize the RevenueCat Purchases SDK.
      - observerMode is false, so Purchases will automatically handle finishing transactions. Read more about Observer Mode here: https://docs.revenuecat.com/docs/observer-mode
      - useAmazon is false, so it will use the Play Store in Android and App Store in iOS by default.
      */
    Purchases.configure({
      apiKey: "appl_qxPtMlTGjvHkhlNlnKlOenNikGN",
      appUserID: user?.uid,
      observerMode: false,
      useAmazon: false,
    });

    Purchases.addCustomerInfoUpdateListener((info) => {
      if (info.entitlements.active.pro) setIsPro(true);
      else setIsPro(false);
      // handle any changes to customerInfo
    });
  }, [setIsPro, user]);

  useEffect(() => {
    async function requestUserPermission() {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      const docSnapshot = await firestore()
        .collection("users")
        .doc(user!.uid)
        .get();
      if (enabled) {
        if (!docSnapshot.data()?.notifications) {
          // Only set notification preferences to true if they haven't been set before
          await firestore()
            .collection("users")
            .doc(user!.uid)
            .update({ notifications: { day: true, week: true } });
        }
        const token = await messaging().getToken();
        await saveTokenToDatabase(token);
        // Listen to whether the token changes
        return messaging().onTokenRefresh(
          async (token) => await saveTokenToDatabase(token),
        );
      }
    }

    async function saveTokenToDatabase(token: string) {
      // Add the token to the users datastore
      await firestore()
        .collection("users")
        .doc(user!.uid)
        .update({ deviceToken: token });
    }

    if (user) {
      requestUserPermission();
      setInitializing(false);
    } else {
      setInitializing(false);
    }
  }, [user]);

  if (initializing) return null;

  return (
    <AppProvider>
      <Navigation colorScheme={colorScheme} />
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />
    </AppProvider>
  );
}
