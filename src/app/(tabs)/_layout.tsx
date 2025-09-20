import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "@react-native-firebase/firestore";
import { useQueryClient } from "@tanstack/react-query";
import { Icon, Label, NativeTabs } from "expo-router/build/native-tabs";
import * as StoreReview from "expo-store-review";
import { useEffect } from "react";

import { FirestoreMovie } from "@/interfaces/firebase";
import { getGameRelease } from "@/screens/Countdown/api/getGameCountdowns";
import { getMovie } from "@/screens/Countdown/api/getMovieCountdowns";
import { useAppConfigStore } from "@/stores/appConfig";
import { useStore } from "@/stores/store";

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
    <NativeTabs>
      <NativeTabs.Trigger name="(find)">
        <Label>Home</Label>
        <Icon sf="house.fill" drawable="custom_android_drawable" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(countdown)">
        <Label>Countdown</Label>
        <Icon sf="timer" drawable="custom_android_drawable" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(settings)">
        <Label>Settings</Label>
        <Icon sf="gear" drawable="custom_android_drawable" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(search)" role="search">
        <Label>Search</Label>
        <Icon sf="magnifyingglass" drawable="custom_android_drawable" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
