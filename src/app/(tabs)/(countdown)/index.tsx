import {
  arrayRemove,
  doc,
  getFirestore,
  writeBatch,
} from "@react-native-firebase/firestore";
import { useScrollToTop } from "@react-navigation/native";
import { Stack } from "expo-router";
import { useRef, useState } from "react";
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

export default function Countdown() {
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
  const { data: movies, pending: isMoviesPending } = useMovieCountdowns();
  const { data: gameReleases, pending: isGamesPending } = useGameCountdowns();
  const { movieSubs, gameSubs } = useSubscriptionStore();
  const [filter, setFilter] = useState<"all" | "movies" | "games">("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "released" | "unreleased"
  >("all");

  const mediaFilterActions = [
    {
      id: "all",
      label: "All Items",
      icon: "square.grid.3x1.below.line.grid.1x2",
    },
    { id: "movies", label: "Movies", icon: "film" },
    { id: "games", label: "Games", icon: "gamecontroller" },
  ] as const;

  const statusFilterActions = [
    { id: "all", label: "All Items" },
    { id: "unreleased", label: "Unreleased" },
    { id: "released", label: "Released" },
  ] as const;

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

  if (isMoviesPending || isGamesPending) return <LoadingScreen />;

  const todayString = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

  // Precompute flattened and sorted data
  const flattenedMovies = movies
    .filter((movie) => {
      if (statusFilter === "all") return true;
      // Treat movies without release dates (TBD) as unreleased
      if (!movie?.releaseDate) return statusFilter === "unreleased";
      const isReleased = movie.releaseDate <= todayString;
      return statusFilter === "released" ? isReleased : !isReleased;
    })
    .sort((a, b) => {
      if (!a?.releaseDate) return 1; // Place undefined dates at the end
      if (!b?.releaseDate) return -1; // Place undefined dates at the end
      return a.releaseDate.localeCompare(b.releaseDate); // Lexicographical comparison
    });

  const flattenedGames = gameReleases
    .filter((game) => {
      if (statusFilter === "all") return true;
      // Treat games without dates (TBD) as unreleased
      if (!game?.date) return statusFilter === "unreleased";
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
    <>
      <Stack.Toolbar placement="left">
        {isEditing && (
          <Stack.Toolbar.Button onPress={deleteItems}>
            <Stack.Toolbar.Icon sf="trash" />
          </Stack.Toolbar.Button>
        )}
      </Stack.Toolbar>
      <Stack.Screen.Title large>Countdown</Stack.Screen.Title>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Menu>
          <Stack.Toolbar.Icon sf="line.3.horizontal.decrease" />
          {mediaFilterActions.map((action) => (
            <Stack.Toolbar.MenuAction
              key={action.id}
              icon={action.icon}
              isOn={filter === action.id}
              onPress={() => setFilter(action.id)}
            >
              {action.label}
            </Stack.Toolbar.MenuAction>
          ))}
          <Stack.Toolbar.Menu title="Status Options">
            {statusFilterActions.map((action) => (
              <Stack.Toolbar.MenuAction
                key={action.id}
                isOn={statusFilter === action.id}
                onPress={() => setStatusFilter(action.id)}
              >
                {action.label}
              </Stack.Toolbar.MenuAction>
            ))}
          </Stack.Toolbar.Menu>
        </Stack.Toolbar.Menu>
        <Stack.Toolbar.Button
          onPress={() => {
            toggleIsEditing();
            if (isEditing) clearSelections();
          }}
          variant={!isEditing ? "plain" : "done"}
        >
          <Stack.Toolbar.Icon sf="pencil" />
        </Stack.Toolbar.Button>
      </Stack.Toolbar>
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
    </>
  );
}
