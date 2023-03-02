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
import {
  finishTransactionAsync,
  IAPResponseCode,
  setPurchaseListener,
} from "expo-in-app-purchases";
import React, { useEffect, useState } from "react";
import { Platform, StatusBar, View } from "react-native";
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

  if (Platform.OS === "ios") {
    setPurchaseListener(({ responseCode, results, errorCode }) => {
      // Purchase was successful
      if (responseCode === IAPResponseCode.OK) {
        results?.forEach((purchase) => {
          if (!purchase.acknowledged) {
            console.log(`Successfully purchased ${purchase.productId}`);
            // Process transaction here and unlock content...
            // Then when you're done
            finishTransactionAsync(purchase, true);
          }
        });
      } else if (responseCode === IAPResponseCode.USER_CANCELED) {
        console.log("User canceled the transaction");
      } else if (responseCode === IAPResponseCode.DEFERRED) {
        console.log(
          "User does not have permissions to buy but requested parental approval (iOS only)"
        );
      } else {
        console.warn(
          `Something went wrong with the purchase. Received errorCode ${errorCode}`
        );
      }
    });
  }

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
