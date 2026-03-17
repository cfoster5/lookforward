import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "@react-native-firebase/firestore";
import { useQueryClient } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { usePostHog } from "posthog-react-native";
import { useEffect, useState } from "react";

import { useAuthenticatedUser } from "@/hooks/useAuthenticatedUser";
import { useWidgetSync } from "@/hooks/useWidgetSync";
import { FirestoreMovie, FirestorePerson } from "@/interfaces/firebase";
import { getGameRelease } from "@/screens/Countdown/api/getGameCountdowns";
import { getMovie } from "@/screens/Countdown/api/getMovieCountdowns";
import { getPersonCountdown } from "@/screens/Countdown/api/getPersonCountdowns";
import { useAppConfigStore } from "@/stores/appConfig";
import { useSubscriptionStore } from "@/stores/subscription";
import { useSubscriptionHistoryStore } from "@/stores/subscriptionHistory";

export default function TabStack() {
  const [hasResolvedInitialUrl, setHasResolvedInitialUrl] = useState(false);
  const [hasLaunchDeepLink, setHasLaunchDeepLink] = useState(false);
  const user = useAuthenticatedUser();
  const posthog = usePostHog();
  const setMovieSubs = useSubscriptionStore((s) => s.setMovieSubs);
  const setGameSubs = useSubscriptionStore((s) => s.setGameSubs);
  const setPersonSubs = useSubscriptionStore((s) => s.setPersonSubs);
  const movieSubs = useSubscriptionStore((s) => s.movieSubs);
  const gameSubs = useSubscriptionStore((s) => s.gameSubs);
  const personSubs = useSubscriptionStore((s) => s.personSubs);
  const { backfillFromCurrentSubs } = useSubscriptionHistoryStore();
  const {
    hasCompletedCommitment,
    hasSeenOnboardingModal,
    hasCompletedInterestSelection,
  } = useAppConfigStore();
  // Sync subscription data to the widget
  useWidgetSync();

  useEffect(() => {
    let isMounted = true;

    Linking.getInitialURL()
      .then((url) => {
        if (!isMounted) return;
        setHasLaunchDeepLink(Boolean(url));
      })
      .finally(() => {
        if (!isMounted) return;
        setHasResolvedInitialUrl(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

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

    const personQuery = query(
      collection(db, "people"),
      where("subscribers", "array-contains", user.uid),
    );

    const personSubscription = onSnapshot(personQuery, (snapshot) => {
      const personSubsData: FirestorePerson[] = snapshot.docs.map((doc) => ({
        ...doc.data(),
        documentID: doc.id,
      }));
      setPersonSubs(personSubsData);
    });

    // Stop listening for updates when no longer required
    return () => {
      // Unmounting
      movieSubscription();
      gameSubscription();
      personSubscription();
    };
  }, [backfillFromCurrentSubs, setGameSubs, setMovieSubs, setPersonSubs, user]);

  useEffect(() => {
    if (!hasResolvedInitialUrl || hasLaunchDeepLink) return;
    if (!hasCompletedInterestSelection) {
      posthog.capture("first_open");
      router.replace("/interest-selection");
    } else if (!hasSeenOnboardingModal) {
      router.replace("/onboarding");
    } else if (!hasCompletedCommitment) {
      router.replace("/commitment");
    }
  }, [
    hasCompletedCommitment,
    hasCompletedInterestSelection,
    hasLaunchDeepLink,
    hasResolvedInitialUrl,
    hasSeenOnboardingModal,
    posthog,
  ]);

  const queryClient = useQueryClient();

  const movieLanguage = useAppConfigStore((state) => state.movieLanguage);
  const movieRegion = useAppConfigStore((state) => state.movieRegion);

  // Prefetch movie and game relase date details and place them in the cache
  useEffect(() => {
    movieSubs.forEach((sub) => {
      queryClient.prefetchQuery({
        queryKey: ["movieSub", sub.documentID, movieLanguage, movieRegion],
        queryFn: () => getMovie(sub.documentID, movieLanguage, movieRegion),
      });
    });
  }, [movieSubs, queryClient, movieLanguage, movieRegion]);

  useEffect(() => {
    gameSubs.map((sub) => {
      queryClient.prefetchQuery({
        queryKey: ["gameRelease", Number(sub.documentID)],
        queryFn: () => getGameRelease(Number(sub.documentID)),
      });
    });
  }, [gameSubs, queryClient]);

  useEffect(() => {
    personSubs.forEach((sub) => {
      queryClient.prefetchQuery({
        queryKey: [
          "personCountdown",
          sub.documentID,
          movieLanguage,
          movieRegion,
        ],
        queryFn: () =>
          getPersonCountdown(
            Number(sub.documentID),
            sub.name,
            sub.profilePath,
            movieLanguage,
            movieRegion,
          ),
      });
    });
  }, [personSubs, queryClient, movieLanguage, movieRegion]);

  return (
    <NativeTabs>
      <NativeTabs.Trigger name="(find)">
        <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(countdown)">
        <NativeTabs.Trigger.Icon sf="timer" md="timer" />
        <NativeTabs.Trigger.Label>Countdown</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(settings)">
        <NativeTabs.Trigger.Icon sf="gear" md="settings" />
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(search)" role="search">
        <NativeTabs.Trigger.Icon sf="magnifyingglass" md="search" />
        <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
