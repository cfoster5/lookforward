import {
  arrayRemove,
  doc,
  getFirestore,
  writeBatch,
} from "@react-native-firebase/firestore";
import { MenuView } from "@react-native-menu/menu";
import { useScrollToTop } from "@react-navigation/native";
import { Stack } from "expo-router";
import { useRef, useState } from "react";
import { Platform, Pressable, SectionList, View } from "react-native";

import { CollectionProgressCard } from "@/components/Collections/CollectionProgressCard";
import { CountdownLimitBanner } from "@/components/CountdownLimitBanner";
import { IconSymbol } from "@/components/IconSymbol";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useAuthenticatedUser } from "@/hooks/useAuthenticatedUser";
import { useCollectionsProgress } from "@/hooks/useCollectionProgress";
import { useGameCountdowns } from "@/screens/Countdown/api/getGameCountdowns";
import { useMovieCountdowns } from "@/screens/Countdown/api/getMovieCountdowns";
import { usePersonCountdowns } from "@/screens/Countdown/api/getPersonCountdowns";
import { CountdownItem } from "@/screens/Countdown/components/CountdownItem";
import { EmptyState } from "@/screens/Countdown/components/EmptyState";
import { FilteredEmptyState } from "@/screens/Countdown/components/FilteredEmptyState";
import { SectionHeader } from "@/screens/Countdown/components/SectionHeader";
import { useCountdownStore } from "@/stores/countdown";
import { useSubscriptionStore } from "@/stores/subscription";
import { useSubscriptionHistoryStore } from "@/stores/subscriptionHistory";
import { colors } from "@/theme/colors";

export default function Countdown() {
  const {
    isEditing,
    toggleIsEditing,
    clearSelections,
    movies: selectedMovies,
    games: selectedGames,
    people: selectedPeople,
  } = useCountdownStore();
  const user = useAuthenticatedUser();
  const scrollRef = useRef<SectionList>(null);
  useScrollToTop(scrollRef);
  const { data: movies, pending: isMoviesPending } = useMovieCountdowns();
  const { data: gameReleases, pending: isGamesPending } = useGameCountdowns();
  const { data: personCountdowns, pending: isPersonPending } =
    usePersonCountdowns();
  const { movieSubs, gameSubs, personSubs } = useSubscriptionStore();
  const { collectionsWithProgress } = useCollectionsProgress();
  const [filter, setFilter] = useState<"all" | "movies" | "games" | "people">(
    "all",
  );
  const [statusFilter, setStatusFilter] = useState<
    "all" | "released" | "unreleased"
  >("all");

  const mediaFilterActions = [
    {
      id: "all" as const,
      label: "All Items",
      icon: "square.grid.3x1.below.line.grid.1x2",
    },
    { id: "movies" as const, label: "Movies", icon: "film" },
    ...(personSubs.length > 0
      ? [{ id: "people" as const, label: "People", icon: "person.2" }]
      : []),
    { id: "games" as const, label: "Games", icon: "gamecontroller" },
  ];

  const statusFilterActions = [
    { id: "all", label: "All Items" },
    { id: "unreleased", label: "Unreleased" },
    { id: "released", label: "Released" },
  ] as const;

  const deleteItems = async () => {
    const db = getFirestore();
    const batch = writeBatch(db);
    const { removeFromHistory } = useSubscriptionHistoryStore.getState();
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
    selectedPeople.forEach((selection) => {
      const docRef = doc(db, "people", selection.toString());
      batch.update(docRef, {
        subscribers: arrayRemove(user.uid),
      });
    });
    await batch.commit();
    for (const movieId of selectedMovies) {
      removeFromHistory(movieId.toString());
    }
    toggleIsEditing();
    clearSelections();
  };

  if (
    isMoviesPending ||
    isGamesPending ||
    (personSubs.length > 0 && isPersonPending)
  )
    return <LoadingScreen />;

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

  const totalCountdowns =
    movieSubs.length + gameSubs.length + personSubs.length;

  // Show empty state when user has no countdowns
  if (totalCountdowns === 0) return <EmptyState />;

  // Filter sections based on selected filter and remove empty sections
  const sections = [
    ...(filter === "all" || filter === "movies"
      ? [{ data: flattenedMovies, title: "Movies" }]
      : []),
    ...(personSubs.length > 0 && (filter === "all" || filter === "people")
      ? [{ data: personCountdowns, title: "People" }]
      : []),
    ...(filter === "all" || filter === "games"
      ? [{ data: flattenedGames, title: "Games" }]
      : []),
  ].filter((section) => section.data.length > 0);

  // Show filtered empty state when no items match the status filter
  if (sections.length === 0 && (statusFilter !== "all" || filter !== "all")) {
    return (
      <FilteredEmptyState statusFilter={statusFilter} mediaFilter={filter} />
    );
  }

  return (
    <>
      {Platform.OS === "android" && (
        <Stack.Screen
          options={{
            headerLeft: () =>
              isEditing ? (
                <Pressable onPress={deleteItems} hitSlop={8}>
                  <IconSymbol
                    name="trash"
                    size={24}
                    color={colors.systemRed as string}
                  />
                </Pressable>
              ) : null,
            headerRight: () => (
              <View style={{ flexDirection: "row", gap: 16 }}>
                <MenuView
                  onPressAction={({ nativeEvent: { event } }) => {
                    const mediaIds = mediaFilterActions.map((a) => a.id);
                    if (mediaIds.includes(event as typeof filter)) {
                      setFilter(event as typeof filter);
                    } else {
                      setStatusFilter(event as typeof statusFilter);
                    }
                  }}
                  actions={[
                    ...mediaFilterActions.map((action) => ({
                      id: action.id,
                      title: action.label,
                      state: (filter === action.id ? "on" : "off") as
                        | "on"
                        | "off",
                    })),
                    ...(filter !== "people"
                      ? [
                          {
                            id: "status-group",
                            title: "Status",
                            subactions: statusFilterActions.map((action) => ({
                              id: action.id,
                              title: action.label,
                              state: (statusFilter === action.id
                                ? "on"
                                : "off") as "on" | "off",
                            })),
                          },
                        ]
                      : []),
                  ]}
                >
                  <Pressable hitSlop={8}>
                    <IconSymbol
                      name="line.3.horizontal"
                      size={24}
                      color={colors.label as string}
                    />
                  </Pressable>
                </MenuView>
                <Pressable
                  onPress={() => {
                    toggleIsEditing();
                    if (isEditing) clearSelections();
                  }}
                  hitSlop={8}
                >
                  <IconSymbol
                    name="pencil"
                    size={24}
                    color={
                      isEditing
                        ? (colors.systemBlue as string)
                        : (colors.label as string)
                    }
                  />
                </Pressable>
              </View>
            ),
          }}
        />
      )}
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
          {filter !== "people" && (
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
          )}
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
        sections={sections}
        stickySectionHeadersEnabled={false}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item, section, index }) => (
          <CountdownItem
            item={item}
            sectionName={section.title}
            isFirstInSection={index === 0}
            isLastInSection={index + 1 === section.data.length}
          />
        )}
        renderSectionHeader={({ section }) => (
          <SectionHeader
            section={section}
            sectionIndex={sections.findIndex((s) => s.title === section.title)}
          />
        )}
        ListHeaderComponent={
          <>
            <CountdownLimitBanner />
            {Platform.OS === "ios" &&
              collectionsWithProgress.map(({ collection, progress }) => (
                <CollectionProgressCard
                  key={collection.id}
                  collection={collection}
                  progress={progress}
                />
              ))}
          </>
        }
        ref={scrollRef}
      />
    </>
  );
}
