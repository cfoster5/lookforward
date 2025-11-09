import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "@react-native-firebase/firestore";
import { useQueryClient } from "@tanstack/react-query";
import {
  Icon,
  Label,
  NativeTabs,
  VectorIcon,
} from "expo-router/build/native-tabs";
import { useEffect } from "react";
import { Platform } from "react-native";

import { useAuthenticatedUser } from "@/hooks/useAuthenticatedUser";
import { FirestoreMovie } from "@/interfaces/firebase";
import { getGameRelease } from "@/screens/Countdown/api/getGameCountdowns";
import { getMovie } from "@/screens/Countdown/api/getMovieCountdowns";
import { useSubscriptionStore, useInterfaceStore } from "@/stores";
import { useAppConfigStore } from "@/stores/appConfig";

export default function TabStack() {
  const user = useAuthenticatedUser();
  const { setMovieSubs, setGameSubs, movieSubs, gameSubs } =
    useSubscriptionStore();
  const { onboardingModalRef } = useInterfaceStore();
  const { hasSeenOnboardingModal, setHasSeenOnboardingModal } =
    useAppConfigStore();

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
  }, [setGameSubs, setMovieSubs, user]);

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
        {Platform.select({
          ios: <Icon sf="house.fill" />,
          android: (
            <Icon src={<VectorIcon family={MaterialIcons} name="home" />} />
          ),
        })}
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(countdown)">
        <Label>Countdown</Label>
        {Platform.select({
          ios: <Icon sf="timer" />,
          android: (
            <Icon src={<VectorIcon family={MaterialIcons} name="timer" />} />
          ),
        })}
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(settings)">
        <Label>Settings</Label>
        {Platform.select({
          ios: <Icon sf="gear" />,
          android: (
            <Icon src={<VectorIcon family={MaterialIcons} name="settings" />} />
          ),
        })}
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(search)" role="search">
        <Label>Search</Label>
        {Platform.select({
          ios: <Icon sf="magnifyingglass" />,
          android: (
            <Icon src={<VectorIcon family={MaterialIcons} name="search" />} />
          ),
        })}
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
