import {
  arrayRemove,
  doc,
  getFirestore,
  writeBatch,
} from "@react-native-firebase/firestore";
import { useScrollToTop } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useLayoutEffect, useRef, useState } from "react";
import { Platform, SectionList } from "react-native";

import { LoadingScreen } from "@/components/LoadingScreen";
import { useAuthenticatedUser } from "@/hooks/useAuthenticatedUser";
import { useGameCountdowns } from "@/screens/Countdown/api/getGameCountdowns";
import { useMovieCountdowns } from "@/screens/Countdown/api/getMovieCountdowns";
import { CountdownItem } from "@/screens/Countdown/components/CountdownItem";
import { EmptyState } from "@/screens/Countdown/components/EmptyState";
import { FilteredEmptyState } from "@/screens/Countdown/components/FilteredEmptyState";
import { SectionHeader } from "@/screens/Countdown/components/SectionHeader";
import { CountdownLimitBanner } from "@/screens/Search/components/CountdownLimitBanner";
import { useCountdownStore, useSubscriptionStore } from "@/stores";

import { createHeaderItem, HEADER_ITEMS } from "../(find,countdown)/_layout";

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
  const [filter, setFilter] = useState<"all" | "movies" | "games">("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "released" | "unreleased"
  >("all");

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
          : [createHeaderItem("delete", { onPress: () => deleteItems() })],
      unstable_headerRightItems: () =>
        movieSubs.length || gameSubs.length
          ? [
              !isEditing &&
                createHeaderItem("filter", {
                  type: "menu",
                  // changesSelectionAsPrimaryAction: true,
                  menu: {
                    // title: "Filter",
                    items: [
                      {
                        type: "action",
                        label: "All Items",
                        icon: {
                          type: "sfSymbol",
                          name: "square.grid.3x1.below.line.grid.1x2",
                        },
                        onPress: () => setFilter("all"),
                        state: filter === "all" ? "on" : "off",
                      },
                      {
                        type: "action",
                        label: "Movies",
                        icon: { type: "sfSymbol", name: "film" },
                        onPress: () => setFilter("movies"),
                        state: filter === "movies" ? "on" : "off",
                      },
                      {
                        type: "action",
                        label: "Games",
                        icon: { type: "sfSymbol", name: "gamecontroller" },
                        onPress: () => setFilter("games"),
                        state: filter === "games" ? "on" : "off",
                      },
                      {
                        type: "submenu",
                        // changesSelectionAsPrimaryAction: true,
                        // icon: {
                        //   type: "sfSymbol",
                        //   name: "line.3.horizontal.decrease",
                        // },
                        label: "Status Options",
                        items: [
                          {
                            type: "action",
                            label: "All Items",
                            onPress: () => setStatusFilter("all"),
                            state: statusFilter === "all" ? "on" : "off",
                          },
                          {
                            type: "action",
                            label: "Unreleased",
                            onPress: () => setStatusFilter("unreleased"),
                            state: statusFilter === "unreleased" ? "on" : "off",
                          },
                          {
                            type: "action",
                            label: "Released",
                            onPress: () => setStatusFilter("released"),
                            state: statusFilter === "released" ? "on" : "off",
                          },
                        ],
                      },
                    ],
                  },
                }),
              createHeaderItem("editPencil", {
                onPress: () => {
                  toggleIsEditing();
                  if (isEditing) clearSelections();
                },
                variant: !isEditing ? "plain" : "done",
              }),
            ].filter(Boolean)
          : [],
    });
  }, [
    clearSelections,
    filter,
    gameSubs.length,
    isEditing,
    movieSubs.length,
    navigation,
    selectedGames,
    selectedMovies,
    statusFilter,
    toggleIsEditing,
    user.uid,
  ]);

  if (isLoading) return <LoadingScreen />;

  const todayString = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

  // Precompute flattened and sorted data
  const flattenedMovies = movies
    .flatMap((movie) => movie.data)
    .filter((movie) => {
      if (statusFilter === "all") return true;
      if (!movie?.releaseDate) return false;
      const isReleased = movie.releaseDate <= todayString;
      return statusFilter === "released" ? isReleased : !isReleased;
    })
    .sort((a, b) => {
      if (!a?.releaseDate) return 1; // Place undefined dates at the end
      if (!b?.releaseDate) return -1; // Place undefined dates at the end
      return a.releaseDate.localeCompare(b.releaseDate); // Lexicographical comparison
    });

  const flattenedGames = gameReleases
    .flatMap((release) => release.data)
    .filter((game) => {
      if (statusFilter === "all") return true;
      if (!game?.date) return false;
      // Convert string timestamp to number, then to date string
      const gameDateString = new Date(Number(game.date) * 1000)
        .toISOString()
        .split("T")[0];
      const isReleased = gameDateString <= todayString;
      return statusFilter === "released" ? isReleased : !isReleased;
    })
    .sort((a, b) => {
      if (!a?.date) return 1; // Place undefined dates at the end
      if (!b?.date) return -1; // Place undefined dates at the end
      return a.date - b.date; // Numeric comparison for valid dates
    });

  const totalCountdowns = movieSubs.length + gameSubs.length;

  // Show empty state when user has no countdowns
  if (totalCountdowns === 0) return <EmptyState />;

  // Filter sections based on selected filter and remove empty sections
  const sections = [
    ...(filter === "all" || filter === "movies"
      ? [{ data: flattenedMovies, title: "Movies" }]
      : []),
    ...(filter === "all" || filter === "games"
      ? [{ data: flattenedGames, title: "Games" }]
      : []),
  ].filter((section) => section.data.length > 0);

  // Show filtered empty state when no items match the status filter
  if (sections.length === 0 && statusFilter !== "all") {
    return (
      <FilteredEmptyState statusFilter={statusFilter} mediaFilter={filter} />
    );
  }

  return (
    <SectionList
      contentContainerStyle={{
        marginHorizontal: 16,
        ...Platform.select({ ios: { paddingBottom: 16 } }),
      }}
      automaticallyAdjustsScrollIndicatorInsets
      contentInsetAdjustmentBehavior="automatic"
      // scrollIndicatorInsets={{ bottom: paddingBottom }}
      sections={sections}
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
          sectionIndex={sections.findIndex((s) => s.title === section.title)}
        />
      )}
      ListHeaderComponent={<CountdownLimitBanner />}
      ref={scrollRef}
    />
  );
}
