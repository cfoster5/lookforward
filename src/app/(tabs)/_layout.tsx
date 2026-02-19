import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "@react-native-firebase/firestore";
import { useQueryClient } from "@tanstack/react-query";
import { router, VectorIcon } from "expo-router";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { usePostHog } from "posthog-react-native";
import { useEffect } from "react";

import { useAuthenticatedUser } from "@/hooks/useAuthenticatedUser";
import { useWidgetSync } from "@/hooks/useWidgetSync";
import { FirestoreMovie } from "@/interfaces/firebase";
import { getGameRelease } from "@/screens/Countdown/api/getGameCountdowns";
import { getMovie } from "@/screens/Countdown/api/getMovieCountdowns";
import { useSubscriptionStore } from "@/stores";
import { useAppConfigStore } from "@/stores/appConfig";
import { useSubscriptionHistoryStore } from "@/stores/subscriptionHistory";

export default function TabStack() {
  const user = useAuthenticatedUser();
  const { setMovieSubs, setGameSubs, movieSubs, gameSubs } =
    useSubscriptionStore();
  const { backfillFromCurrentSubs } = useSubscriptionHistoryStore();
  const {
    hasCompletedCommitment,
    hasSeenOnboardingModal,
    setHasSeenOnboardingModal,
  } = useAppConfigStore();
  const posthog = usePostHog();
  // Sync subscription data to the widget
  useWidgetSync();

  useEffect(() => {
    const db = getFirestore();

    const movieQuery = query(
      collection(db, "movies"),
      where("subscribers", "array-contains", user.uid),
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

      // Backfill subscription history for existing users
      const movieIds = movieSubsData.map((movie) => movie.documentID);
      backfillFromCurrentSubs(movieIds);
    });

    const gameQuery = query(
      collection(db, "gameReleases"),
      where("subscribers", "array-contains", user.uid),
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
  }, [backfillFromCurrentSubs, setGameSubs, setMovieSubs, user]);

  useEffect(() => {
    if (!hasCompletedCommitment) {
      router.replace("/commitment");
    }
  }, [hasCompletedCommitment]);

  useEffect(() => {
    if (hasCompletedCommitment && !hasSeenOnboardingModal) {
      posthog.capture("first_open");
      router.push("/onboarding");
      setHasSeenOnboardingModal();
    }
  }, [
    hasCompletedCommitment,
    hasSeenOnboardingModal,
    posthog,
    setHasSeenOnboardingModal,
  ]);

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
        <NativeTabs.Trigger.Icon
          sf="house.fill"
          src={<VectorIcon family={MaterialIcons} name="home" />}
        />
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(countdown)">
        <NativeTabs.Trigger.Icon
          sf="timer"
          src={<VectorIcon family={MaterialIcons} name="timer" />}
        />
        <NativeTabs.Trigger.Label>Countdown</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(settings)">
        <NativeTabs.Trigger.Icon
          sf="gear"
          src={<VectorIcon family={MaterialIcons} name="settings" />}
        />
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(search)" role="search">
        <NativeTabs.Trigger.Icon
          sf="magnifyingglass"
          src={<VectorIcon family={MaterialIcons} name="search" />}
        />
        <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
