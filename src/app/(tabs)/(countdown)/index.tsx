import {
  arrayRemove,
  doc,
  getFirestore,
  writeBatch,
} from "@react-native-firebase/firestore";
import { useScrollToTop } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useLayoutEffect, useRef } from "react";
import { Platform, SectionList } from "react-native";

import { LoadingScreen } from "@/components/LoadingScreen";
import { useAuthenticatedUser } from "@/hooks/useAuthenticatedUser";
import { useGameCountdowns } from "@/screens/Countdown/api/getGameCountdowns";
import { useMovieCountdowns } from "@/screens/Countdown/api/getMovieCountdowns";
import { CountdownItem } from "@/screens/Countdown/components/CountdownItem";
import { EmptyState } from "@/screens/Countdown/components/EmptyState";
import { SectionHeader } from "@/screens/Countdown/components/SectionHeader";
import { CountdownLimitBanner } from "@/screens/Search/components/CountdownLimitBanner";
import { useCountdownStore, useSubscriptionStore } from "@/stores";

export default function Countdown() {
  const navigation = useNavigation();
  const {
    isEditing,
    toggleIsEditing,
    clearSelections,
    movies: selectedMovies,
    games: selectedGames,
  } = useCountdownStore();
  const user = useAuthenticatedUser();
  const scrollRef = useRef<SectionList>(null);
  useScrollToTop(scrollRef);
  const movies = useMovieCountdowns();
  const gameReleases = useGameCountdowns();
  const { movieSubs, gameSubs } = useSubscriptionStore();

  const isLoading =
    movies.some((movie) => movie.isLoading) ||
    gameReleases.some((release) => release.isLoading);

  useLayoutEffect(() => {
    const deleteItems = async () => {
      const db = getFirestore();
      const batch = writeBatch(db);
      selectedMovies.map((selection) => {
        const docRef = doc(db, "movies", selection.toString());
        batch.update(docRef, {
          subscribers: arrayRemove(user.uid),
        });
      });
      selectedGames.map((selection) => {
        const docRef = doc(db, "gameReleases", selection.toString());
        batch.update(docRef, {
          subscribers: arrayRemove(user.uid),
        });
      });
      await batch.commit();
      toggleIsEditing();
      clearSelections();
    };

    navigation.setOptions({
      unstable_headerLeftItems: () =>
        !isEditing
          ? []
          : [
              {
                type: "button",
                label: "Delete",
                icon: { type: "sfSymbol", name: "trash" },
                onPress: () => deleteItems(),
              },
            ],
      unstable_headerRightItems: () =>
        movieSubs.length || gameSubs.length
          ? [
              {
                type: "button",
                label: "Edit",
                icon: { type: "sfSymbol", name: "pencil" },
                onPress: () => {
                  toggleIsEditing();
                  if (isEditing) clearSelections();
                },
                variant: !isEditing ? "plain" : "done",
              },
            ]
          : [],
    });
  }, [
    clearSelections,
    gameSubs.length,
    isEditing,
    movieSubs.length,
    navigation,
    selectedGames,
    selectedMovies,
    toggleIsEditing,
    user.uid,
  ]);

  if (isLoading) return <LoadingScreen />;

  // Precompute flattened and sorted data
  const flattenedMovies = movies
    .flatMap((movie) => movie.data)
    .sort((a, b) => {
      if (!a?.releaseDate) return 1; // Place undefined dates at the end
      if (!b?.releaseDate) return -1; // Place undefined dates at the end
      return a.releaseDate.localeCompare(b.releaseDate); // Lexicographical comparison
    });

  const flattenedGames = gameReleases
    .flatMap((release) => release.data)
    .sort((a, b) => {
      if (!a?.date) return 1; // Place undefined dates at the end
      if (!b?.date) return -1; // Place undefined dates at the end
      return a.date - b.date; // Numeric comparison for valid dates
    });

  const totalCountdowns = movieSubs.length + gameSubs.length;

  // Show empty state when user has no countdowns
  if (totalCountdowns === 0) return <EmptyState />;

  return (
    <SectionList
      contentContainerStyle={{
        marginHorizontal: 16,
        ...Platform.select({ ios: { paddingBottom: 16 } }),
      }}
      automaticallyAdjustsScrollIndicatorInsets
      contentInsetAdjustmentBehavior="automatic"
      // scrollIndicatorInsets={{ bottom: paddingBottom }}
      sections={[
        { data: flattenedMovies, title: "Movies" },
        { data: flattenedGames, title: "Games" },
      ]}
      stickySectionHeadersEnabled={false}
      keyExtractor={(item, index) => item + index}
      renderItem={({ item, section, index }) => (
        <CountdownItem
          item={item}
          sectionName={section.title}
          isFirstInSection={index === 0}
          isLastInSection={
            section.title === "Movies"
              ? index + 1 === flattenedMovies.length
              : index + 1 === flattenedGames.length
          }
        />
      )}
      renderSectionHeader={({ section }) => (
        <SectionHeader
          section={section}
          sectionIndex={section.title === "Movies" ? 0 : 1}
        />
      )}
      ListHeaderComponent={<CountdownLimitBanner />}
      ref={scrollRef}
    />
  );
}
