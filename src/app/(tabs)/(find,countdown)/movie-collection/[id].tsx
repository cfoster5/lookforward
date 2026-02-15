import { Stack, useLocalSearchParams } from "expo-router";
import { usePostHog } from "posthog-react-native";
import { useEffect, useRef } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { iOSUIKit } from "react-native-typography";

import { AnimatedHeaderImage } from "@/components/AnimatedHeaderImage";
import { ExpandableText } from "@/components/ExpandableText";
import { LoadingScreen } from "@/components/LoadingScreen";
import { MoviePoster } from "@/components/Posters/MoviePoster";
import { Text as ThemedText } from "@/components/Themed";
import { calculateWidth } from "@/helpers/helpers";
import { useCollection } from "@/screens/Collection/api/getCollection";
import { onShare } from "@/utils/share";

// import { useGetCollection } from "./api/useGetCollection";

const spacing = 16;

export default function Collection() {
  const posthog = usePostHog();
  const { id } = useLocalSearchParams();
  const { data: collection, isLoading } = useCollection(id);
  const scrollOffset = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(
    (e) => (scrollOffset.value = e.contentOffset.y),
  );
  const trackedViewId = useRef<number | null>(null);
  const resolvedCollectionId = collection?.id ?? null;

  useEffect(() => {
    if (
      !isLoading &&
      collection &&
      resolvedCollectionId &&
      trackedViewId.current !== resolvedCollectionId
    ) {
      trackedViewId.current = resolvedCollectionId;
      posthog.capture("movie_collection:view", {
        collection_id: collection.id,
        collection_name: collection.name,
        movie_count: collection.parts.length,
      });
    }
  }, [isLoading, resolvedCollectionId, collection, posthog]);

  if (isLoading) return <LoadingScreen />;

  return (
    <>
      {/* Set title for back navigation but set to transparent to hide title */}
      <Stack.Screen.Title style={{ color: "transparent" }}>
        {collection?.name}
      </Stack.Screen.Title>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          onPress={() =>
            onShare(`movie-collection/${id}`, "headerButton", posthog)
          }
        >
          <Stack.Toolbar.Icon sf="square.and.arrow.up" />
        </Stack.Toolbar.Button>
      </Stack.Toolbar>
      <Animated.FlatList
        ListHeaderComponent={
          <>
            {collection!.backdrop_path && (
              <View style={{ marginHorizontal: -16 }}>
                <AnimatedHeaderImage
                  scrollOffset={scrollOffset}
                  path={collection!.backdrop_path}
                />
              </View>
            )}
            <ThemedText
              style={[iOSUIKit.largeTitleEmphasized, { paddingTop: 16 }]}
            >
              {collection!.name}
            </ThemedText>
            <ExpandableText text={collection!.overview} />
            <View style={{ height: 16 }} />
          </>
        }
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        data={collection!.parts}
        renderItem={({ item, index }) => (
          <MoviePoster
            movie={item}
            posterPath={item.poster_path}
            style={{
              width: calculateWidth(spacing, spacing, 2),
              aspectRatio: 2 / 3,
            }}
            buttonStyle={{
              marginRight: index % 2 === 0 ? spacing / 2 : 0,
              marginLeft: index % 2 === 1 ? spacing / 2 : 0,
            }}
          />
        )}
        numColumns={2}
        contentContainerStyle={{
          marginHorizontal: spacing,
        }}
        automaticallyAdjustsScrollIndicatorInsets
        contentInsetAdjustmentBehavior="automatic"
        // contentInset={{ bottom: paddingBottom }}
        // scrollIndicatorInsets={{ bottom: paddingBottom }}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: spacing,
        }}
        keyExtractor={(movie) => movie.id.toString()}
      />
    </>
  );
}
