import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "@react-native-community/blur";
import firestore from "@react-native-firebase/firestore";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as StoreReview from "expo-store-review";
import { useEffect } from "react";
import { Platform, StyleSheet } from "react-native";

import { useAppConfigStore } from "@/stores/appConfig";
import { useStore } from "@/stores/store";
import { TabNavigationParamList } from "@/types";

import { FirestoreMovie } from "../interfaces/firebase";

import { CountdownStack } from "./CountdownStack";
import { FindStack } from "./FindStack";
import { SettingsStack } from "./SettingsStack";

const Tab = createBottomTabNavigator<TabNavigationParamList>();
export function TabStack() {
  const {
    user,
    setMovieSubs,
    setGameSubs,
    movieSubs,
    gameSubs,
    onboardingModalRef,
  } = useStore();
  const {
    hasRequestedReview,
    setHasRequestedReview,
    hasSeenOnboardingModal,
    setHasSeenOnboardingModal,
  } = useAppConfigStore();

  useEffect(() => {
    const movieSubscription = firestore()
      .collection("movies")
      .where("subscribers", "array-contains", user!.uid)
      .onSnapshot((documentSnapshot) => {
        const movieSubsData: FirestoreMovie[] = documentSnapshot.docs.map(
          (doc) => ({
            ...doc.data(),
            subscribers: doc.data()["subscribers"],
            documentID: doc.id,
          }),
        );
        setMovieSubs(movieSubsData);
      });

    const gameSubscription = firestore()
      .collection("gameReleases")
      .where("subscribers", "array-contains", user!.uid)
      .onSnapshot((documentSnapshot) => {
        const gameSubsData = documentSnapshot.docs.map((doc) => ({
          ...doc.data(),
          documentID: doc.id,
        }));
        setGameSubs(gameSubsData);
      });

    // Stop listening for updates when no longer required
    return () => {
      // Unmounting
      movieSubscription();
      gameSubscription();
    };
  }, [setGameSubs, setMovieSubs, user]);

  useEffect(() => {
    async function requestReview() {
      if (movieSubs.length + gameSubs.length >= 5 && !hasRequestedReview) {
        const isAvailable = await StoreReview.isAvailableAsync();
        if (isAvailable) {
          await StoreReview.requestReview();
          setHasRequestedReview();
        }
      }
    }

    requestReview();
  }, [
    gameSubs.length,
    movieSubs.length,
    hasRequestedReview,
    setHasRequestedReview,
  ]);

  useEffect(() => {
    if (!hasSeenOnboardingModal) {
      onboardingModalRef.current?.present();
      setHasSeenOnboardingModal();
    }
  }, [hasSeenOnboardingModal, onboardingModalRef, setHasSeenOnboardingModal]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "";
          if (route.name === "FindTab") {
            iconName = "search";
          } else if (route.name === "CountdownTab") {
            iconName = "timer-outline";
          } else if (route.name === "SettingsTab") {
            iconName = "cog";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        // tabBarActiveTintColor: PlatformColor("systemBlue"),
        // tabBarInactiveTintColor: "gray",
        tabBarStyle:
          Platform.OS === "ios"
            ? {
                position: "absolute",
              }
            : undefined,
        tabBarBackground: () =>
          Platform.OS === "ios" && <BlurView style={StyleSheet.absoluteFill} />,
      })}
    >
      {/* Is setting headerShown to false the best method? */}
      <Tab.Screen
        name="FindTab"
        component={FindStack}
        options={{ headerShown: false, tabBarLabel: "Find" }}
      />
      <Tab.Screen
        name="CountdownTab"
        component={CountdownStack}
        options={{ headerShown: false, tabBarLabel: "Countdown" }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsStack}
        options={{ headerShown: false, tabBarLabel: "Settings" }}
      />
    </Tab.Navigator>
  );
}
