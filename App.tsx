import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBomb,
  faChildren,
  faFaceLaughSquint,
  faGhost,
  faHandcuffs,
  faHatCowboy,
  faHatWizard,
  faHeart,
  faJetFighter,
  faMagnifyingGlass,
  faMasksTheater,
  faMusic,
  faPersonHiking,
  faPersonRunning,
  faRocket,
  faScroll,
  faUserSecret,
  faVideoCamera,
} from "@fortawesome/free-solid-svg-icons";
import firestore from "@react-native-firebase/firestore";
import messaging from "@react-native-firebase/messaging";
import { useEffect, useState } from "react";
import { StatusBar, View } from "react-native";
import Purchases from "react-native-purchases";
import SplashScreen from "react-native-splash-screen";

import Navigation from "./src/navigation";
import { AppProvider } from "./src/providers/app";
import { useStore } from "./src/stores/store";

library.add(
  faPersonHiking,
  faHatWizard,
  faGhost,
  faMusic,
  faMagnifyingGlass,
  faHeart,
  faJetFighter,
  faHatCowboy,
  faRocket,
  faUserSecret,
  faBomb,
  faHandcuffs,
  faPersonRunning,
  faFaceLaughSquint,
  faMasksTheater,
  faChildren,
  faScroll,
  faVideoCamera
);

export default function App() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const { user } = useStore();
  const [colorScheme] = useState("dark");

  useEffect(() => {
    /* Enable debug logs before calling `setup`. */
    Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);

    /*
      Initialize the RevenueCat Purchases SDK.
      - appUserID is nil, so an anonymous ID will be generated automatically by the Purchases SDK. Read more about Identifying Users here: https://docs.revenuecat.com/docs/user-ids
      - observerMode is false, so Purchases will automatically handle finishing transactions. Read more about Observer Mode here: https://docs.revenuecat.com/docs/observer-mode
      - useAmazon is false, so it will use the Play Store in Android and App Store in iOS by default.
      */
    Purchases.configure({
      apiKey: "appl_qxPtMlTGjvHkhlNlnKlOenNikGN",
      appUserID: null,
      observerMode: false,
      useAmazon: false,
    });
  }, []);

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
          async (token) => await saveTokenToDatabase(token)
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

  useEffect(() => {
    if (!initializing) SplashScreen.hide();
  }, [initializing]);

  if (initializing) return <View />;

  return (
    <AppProvider>
      <Navigation colorScheme={colorScheme} />
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />
    </AppProvider>
  );
}
