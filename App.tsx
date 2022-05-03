import React, { useEffect, useState } from "react";
import { Platform, StatusBar, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SplashScreen from "react-native-splash-screen";
import { OverflowMenuProvider } from "react-navigation-header-buttons";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import messaging from "@react-native-firebase/messaging";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import {
  finishTransactionAsync,
  IAPResponseCode,
  setPurchaseListener,
} from "expo-in-app-purchases";

import TabStackContext from "./src/contexts/TabStackContext";
import { AuthStack } from "./src/navigation/AuthStack";
import { TabStack } from "./src/navigation/TabStack";

export default function App() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User>();
  const [colorScheme, setColorScheme] = useState("dark");

  useEffect(() => {
    // monitorTimeConsumingTask().then(result => setInitializing(false))
    const subscriber = auth().onAuthStateChanged((user) => {
      setUser(user ? user : undefined);
    });
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    if (user) {
      requestUserPermission();
      setInitializing(false);
    } else {
      setInitializing(false);
    }
  }, [user]);

  useEffect(() => {
    if (!initializing) {
      SplashScreen.hide();
    }
  }, [initializing]);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      await firestore()
        .collection("users")
        .doc(user?.uid)
        .collection("contentPreferences")
        .doc("preferences")
        .set({
          weekNotifications: true,
          dayNotifications: true,
        });
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
      .doc(user?.uid)
      .set({ deviceToken: token });
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

  if (initializing) {
    return <View />;
  }
  return (
    <SafeAreaProvider>
      <NavigationContainer
        theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      >
        <StatusBar
          barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        />
        {user ? (
          <OverflowMenuProvider>
            <TabStackContext.Provider
              value={{ user: user.uid, theme: colorScheme }}
            >
              <TabStack />
            </TabStackContext.Provider>
          </OverflowMenuProvider>
        ) : (
          <AuthStack />
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
