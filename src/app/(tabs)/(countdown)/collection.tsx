import {
  Host,
  List,
  Text as AppleText,
  Section,
  VStack,
  HStack,
  RNHostView,
  Button,
  Image as AppleImage,
  Spacer,
} from "@expo/ui/swift-ui";
import {
  foregroundStyle,
  headerProminence,
  lineLimit,
  listStyle,
} from "@expo/ui/swift-ui/modifiers";
import { Ionicons } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import { useQueries } from "@tanstack/react-query";
import { Image } from "expo-image";
import { Color, Link, Stack, useLocalSearchParams } from "expo-router";
import { SFSymbol } from "expo-symbols";
import { usePostHog } from "posthog-react-native";
import { useEffect, useRef } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { iOSUIKit } from "react-native-typography";
import { AppendToResponse, MovieDetails, PosterSize } from "tmdb-ts";

import { useCollection } from "@/api/collections";
import { IconSymbol } from "@/components/IconSymbol";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useCollectionProgress } from "@/hooks/useCollectionProgress";
import { tmdb } from "@/providers/app";
import { formatReleaseDate } from "@/screens/Countdown/utils/countdownItemHelpers";
import { useAppConfigStore } from "@/stores";
import { dateToFullLocale } from "@/utils/dates";

type MovieWithCredits = AppendToResponse<MovieDetails, ["credits"], "movie">;

interface NomineeItemProps {
  movie: MovieWithCredits;
  isTracked: boolean;
}

function NomineeItem({ movie, isTracked }: NomineeItemProps) {
  return (
    <Link
      href={{
        pathname: "/(tabs)/(countdown)/movie/[id]",
        params: { id: movie.id, name: movie.title },
      }}
      asChild
    >
      <Pressable
        style={({ pressed }) => ({
          backgroundColor: pressed
            ? Color.ios.tertiarySystemBackground
            : Color.ios.secondarySystemGroupedBackground,
        })}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              shadowOffset: { width: 0, height: 1 },
              shadowRadius: 4,
              shadowColor: "rgba(0, 0, 0, 0.15)",
              shadowOpacity: 1,
              justifyContent: "center",
            }}
          >
            {movie.poster_path ? (
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/w300${movie.poster_path}`,
                }}
                style={{
                  aspectRatio: 2 / 3,
                  width: 60,
                  borderRadius: 6,
                  marginLeft: 16,
                  marginTop: 8,
                  marginBottom: 8,
                  borderWidth: 1,
                  borderColor: Color.ios.separator,
                }}
              />
            ) : (
              <View
                style={{
                  backgroundColor: Color.ios.systemGray,
                  aspectRatio: 2 / 3,
                  width: 60,
                  borderRadius: 6,
                  marginLeft: 16,
                  marginTop: 8,
                  marginBottom: 8,
                  borderWidth: 1,
                  borderColor: Color.ios.separator,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={[iOSUIKit.caption2White, { textAlign: "center" }]}>
                  {movie.title}
                </Text>
              </View>
            )}
          </View>

          <View style={{ flex: 1, marginHorizontal: 12 }}>
            <Text
              style={[iOSUIKit.body, { color: Color.ios.label }]}
              numberOfLines={2}
            >
              {movie.title}
            </Text>
            <Text
              style={[iOSUIKit.subhead, { color: Color.ios.secondaryLabel }]}
              numberOfLines={1}
            >
              {dateToFullLocale(movie.release_date)}
            </Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            {isTracked && (
              <IconSymbol
                name="checkmark.circle.fill"
                size={20}
                color="#34C759"
              />
            )}
            <Ionicons
              name="chevron-forward"
              size={20}
              color={Color.ios.tertiaryLabel}
            />
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

function ItemSeparator() {
  return (
    <View
      style={{
        height: 1,
        backgroundColor: Color.ios.separator,
        marginLeft: 16 + 60 + 16, // marginLeft + posterWidth + gap
      }}
    />
  );
}

export default function CollectionScreen() {
  const posthog = usePostHog();
  const headerHeight = useHeaderHeight();
  const { bottom } = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const collectionId = id ?? "oscars-2026-best-picture";

  const { data: collection, isPending: isCollectionPending } =
    useCollection(collectionId);
  const movieLanguage = useAppConfigStore((state) => state.movieLanguage);
  const movieRegion = useAppConfigStore((state) => state.movieRegion);

  const movieQueries = useQueries({
    queries: (collection?.movieIds ?? []).map((movieId) => ({
      queryKey: ["movie", Number(movieId), movieLanguage, movieRegion],
      queryFn: () =>
        tmdb.movies.details(
          Number(movieId),
          ["credits"],
          `${movieLanguage}-${movieRegion},null`,
        ),
      enabled: !!collection,
    })),
  });

  const isLoading =
    isCollectionPending || movieQueries.some((q) => q.isPending);
  const movies = movieQueries
    .map((q) => q.data)
    .filter((m): m is MovieWithCredits => m !== undefined);

  const progress = useCollectionProgress(collection ?? null);
  const trackedMovieIds = new Set(progress?.trackedMovieIds ?? []);
  const trackedViewId = useRef<string | null>(null);
  const resolvedCollectionId = collection?.id ?? null;
  const trackedCount = movies.filter((m) =>
    trackedMovieIds.has(m.id.toString()),
  ).length;

  useEffect(() => {
    if (
      !isLoading &&
      collection &&
      resolvedCollectionId &&
      trackedViewId.current !== resolvedCollectionId
    ) {
      trackedViewId.current = resolvedCollectionId;
      posthog.capture("collection:view", {
        collection_id: collection.id,
        collection_name: collection.name,
        category: collection.category,
        total_movies: collection.movieIds.length,
        tracked_count: trackedCount,
      });
    }
  }, [isLoading, resolvedCollectionId, collection, trackedCount, posthog]);

  if (isCollectionPending) return <LoadingScreen />;

  if (!collection) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={[iOSUIKit.body, { color: Color.ios.secondaryLabel }]}>
          Collection not found
        </Text>
      </View>
    );
  }

  if (movieQueries.some((q) => q.isPending)) return <LoadingScreen />;

  const getCategoryIcon = (
    category: "oscars" | "franchise" | "seasonal" | "custom",
  ): SFSymbol => {
    switch (category) {
      case "oscars":
        return "trophy.fill";
      case "franchise":
        return "film.stack.fill";
      case "seasonal":
        return "calendar";
      default:
        return "star.fill";
    }
  };

  const iconName =
    (collection.badgeIcon as SFSymbol) ?? getCategoryIcon(collection.category);

  return (
    <>
      <Stack.Screen.Title large>{collection.name}</Stack.Screen.Title>
      <Host style={{ flex: 1 }}>
        <List modifiers={[listStyle("insetGrouped")]}>
          <Section
            title={`You've been tracking ${trackedCount} of the ${collection.movieIds.length} ${collection.description}.`}
          >
            {movies.map((movie) => (
              <Link
                key={movie.id}
                href={`/(tabs)/(countdown)/movie/${movie.id}`}
                asChild
              >
                {/* Wrap HStack in Button to pass onPress to child component */}
                <Button
                  onPress={() => {
                    posthog.capture("collection:movie_tap", {
                      collection_id: collection.id,
                      movie_id: movie.id,
                      movie_title: movie.title,
                      is_tracked: trackedMovieIds.has(movie.id.toString()),
                    });
                  }}
                >
                  <HStack spacing={18}>
                    <RNHostView matchContents>
                      {/* We shouldn't need to worry about missing posters since this is the Oscars */}
                      <Image
                        source={{
                          uri: `https://image.tmdb.org/t/p/${PosterSize.W185}${movie.poster_path}`,
                        }}
                        style={{
                          // 50 matches slide to delete perfectly
                          // 100 gets to the image halfway point when sliding to delete
                          width: 75,
                          aspectRatio: 2 / 3,
                          borderRadius: 13,
                          borderWidth: StyleSheet.hairlineWidth,
                          borderColor: Color.ios.separator,
                        }}
                        contentFit="cover"
                      />
                    </RNHostView>
                    <VStack alignment="leading">
                      <AppleText
                        modifiers={[foregroundStyle("primary"), lineLimit(2)]}
                      >
                        {movie.title}
                      </AppleText>
                      <AppleText modifiers={[foregroundStyle("secondary")]}>
                        {dateToFullLocale(movie.release_date)}
                      </AppleText>
                    </VStack>
                    <Spacer />
                    {trackedMovieIds.has(movie.id.toString()) && (
                      <AppleImage systemName="checkmark.circle.fill" />
                    )}
                    <AppleImage
                      systemName="chevron.right"
                      color={Color.ios.secondaryLabel}
                    />
                  </HStack>
                </Button>
              </Link>
            ))}
          </Section>
        </List>
      </Host>
    </>
  );

  // return (
  //   <>
  //     {/* <Stack.Screen.Title large>{collection.name}</Stack.Screen.Title> */}
  //     {/*
  //     <Host>
  //       <List modifiers={[listStyle("inset")]}>
  //         {movies.map((movie) => (
  //           <VStack key={movie.id}>
  //             <AppleText>{movie.title}</AppleText>
  //             <AppleText>{movie.release_date}</AppleText>
  //           </VStack>
  //         ))}
  //       </List>
  //     </Host> */}

  //     <FlatList
  //       data={movies}
  //       keyExtractor={(item) => item.id.toString()}
  //       renderItem={({ item }) => (
  //         <NomineeItem
  //           movie={item}
  //           isTracked={trackedMovieIds.has(item.id.toString())}
  //         />
  //       )}
  //       contentInsetAdjustmentBehavior="automatic"
  //       ItemSeparatorComponent={ItemSeparator}
  //       ListHeaderComponent={
  //         <>
  //           {/* <View style={{ padding: 16, gap: 8 }}> */}
  //           <View style={{ paddingHorizontal: 16, gap: 8 }}>
  //             {/* <View
  //               style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
  //             >
  //               <IconSymbol name={iconName} size={24} color="#FFD60A" />
  //               <Text
  //                 style={[iOSUIKit.title3Emphasized, { color: Color.ios.label }]}
  //               >
  //                 {collection.name}
  //               </Text>
  //             </View> */}
  //             <Text style={[iOSUIKit.body, { color: Color.ios.secondaryLabel }]}>
  //               {collection.description}
  //             </Text>
  //             <Text
  //               style={[iOSUIKit.footnote, { color: Color.ios.tertiaryLabel }]}
  //             >
  //               {trackedCount} of {movies.length} tracked
  //             </Text>
  //           </View>
  //           <Stack.Screen.Title large>{collection.name}</Stack.Screen.Title>
  //         </>
  //       }
  //       contentContainerStyle={{
  //         // backgroundColor: Color.ios.secondarySystemGroupedBackground,
  //         // borderRadius: 12,
  //         // marginTop: headerHeight,
  //         // margin: 16,
  //         // marginBottom: bottom,
  //         overflow: "hidden",
  //       }}
  //     />
  //   </>
  // );
}
