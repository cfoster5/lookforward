import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "@react-native-firebase/firestore";
import { useQueryClient } from "@tanstack/react-query";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import * as StoreReview from "expo-store-review";
import { SymbolView } from "expo-symbols";
import { useEffect } from "react";
import { Platform, StyleSheet } from "react-native";

import { FirestoreMovie } from "@/interfaces/firebase";
import { getGameRelease } from "@/screens/Countdown/api/getGameCountdowns";
import { getMovie } from "@/screens/Countdown/api/getMovieCountdowns";
import { useAppConfigStore } from "@/stores/appConfig";
import { useStore } from "@/stores/store";

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

export default function TabStack() {
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
    const db = getFirestore();

    const movieQuery = query(
      collection(db, "movies"),
      where("subscribers", "array-contains", user!.uid),
    );

    const movieSubscription = onSnapshot(movieQuery, (documentSnapshot) => {
      const movieSubsData: FirestoreMovie[] = documentSnapshot.docs.map(
        (doc) => ({
          ...doc.data(),
          subscribers: doc.data()["subscribers"],
          documentID: doc.id,
        }),
      );
      setMovieSubs(movieSubsData);
    });

    const gameQuery = query(
      collection(db, "gameReleases"),
      where("subscribers", "array-contains", user!.uid),
    );

    const gameSubscription = onSnapshot(gameQuery, (documentSnapshot) => {
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
      if (movieSubs.length + gameSubs.length >= 3 && !hasRequestedReview) {
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
        queryKey: ["movieSub", sub.documentID],
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
    <Tabs
      screenOptions={() => ({
        tabBarStyle: Platform.select({ ios: { position: "absolute" } }),
        tabBarBackground: BlurTabBarBackground,
      })}
    >
      {/* Is setting headerShown to false the best method? */}
      <Tabs.Screen
        name="(find)"
        options={{
          headerShown: false,
          tabBarLabel: "Find",
          tabBarIcon: ({ ...props }) => (
            <SymbolView
              {...props}
              name="magnifyingglass"
              tintColor={props.color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(countdown)"
        options={{
          headerShown: false,
          tabBarLabel: "Countdown",
          tabBarIcon: ({ ...props }) => (
            <SymbolView {...props} name="timer" tintColor={props.color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(settings)"
        options={{
          headerShown: false,
          tabBarLabel: "Settings",
          tabBarIcon: ({ ...props }) => (
            <SymbolView {...props} name="gear" tintColor={props.color} />
          ),
        }}
      />
    </Tabs>
  );
}
