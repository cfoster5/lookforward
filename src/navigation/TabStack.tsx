import { Ionicons } from "@expo/vector-icons";
import firestore from "@react-native-firebase/firestore";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useQueryClient } from "@tanstack/react-query";
import { BlurView } from "expo-blur";
import * as StoreReview from "expo-store-review";
import { useEffect } from "react";
import { Platform, StyleSheet } from "react-native";

import { getGameRelease } from "@/screens/Countdown/api/getGameCountdowns";
import { getMovie } from "@/screens/Countdown/api/getMovieCountdowns";
import { useAppConfigStore } from "@/stores/appConfig";
import { useStore } from "@/stores/store";
import { TabNavigationParamList } from "@/types";

import { FirestoreMovie } from "../interfaces/firebase";

import { CountdownStack } from "./CountdownStack";
import { FindStack } from "./FindStack";
import { SettingsStack } from "./SettingsStack";

function BlurTabBarBackground() {
  return (
    <BlurView
      // TODO: Use systemChromeMaterialDark when same can be applied to Search modals
      // System chrome material automatically adapts to the system's theme
      // and matches the native tab bar appearance on iOS.
      // tint="systemChromeMaterial"
      tint="dark"
      intensity={100}
      style={StyleSheet.absoluteFill}
    />
  );
}

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

  const queryClient = useQueryClient();

  // Prefetch movie and game relase date details and place them in the cache
  useEffect(() => {
    movieSubs.forEach((sub) => {
      queryClient.prefetchQuery({
        queryKey: ["movieSubs", sub.documentID],
        queryFn: () => getMovie(sub.documentID),
      });
    });
  }, [movieSubs, queryClient]);

  useEffect(() => {
    gameSubs.map((sub) => {
      queryClient.prefetchQuery({
        queryKey: ["gameRelease", Number(sub.documentID)],
        queryFn: () => getGameRelease(Number(sub.documentID)),
      });
    });
  }, [gameSubs, queryClient]);

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
        tabBarBackground: BlurTabBarBackground,
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
