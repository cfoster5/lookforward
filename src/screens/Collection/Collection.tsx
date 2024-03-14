import {
  BottomTabScreenProps,
  useBottomTabBarHeight,
} from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CollectionDetails } from "interfaces/tmdb";
import { Platform, View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { iOSUIKit } from "react-native-typography";

import { useCollection } from "./api/getCollection";

import { AnimatedHeaderImage } from "@/components/AnimatedHeaderImage";
import { ExpandableText } from "@/components/ExpandableText";
import { LoadingScreen } from "@/components/LoadingScreen";
import { MoviePoster } from "@/components/Posters/MoviePoster";
import { Text as ThemedText } from "@/components/Themed";
import { calculateWidth } from "@/helpers/helpers";
import { FindStackParams, BottomTabParams } from "@/types";

// import { useGetCollection } from "./api/useGetCollection";

type CollectionScreenNavigationProp = CompositeScreenProps<
  NativeStackScreenProps<FindStackParams, "Collection">,
  CompositeScreenProps<
    BottomTabScreenProps<BottomTabParams, "FindTabStack">,
    BottomTabScreenProps<BottomTabParams, "CountdownTabStack">
  >
>;

export function Collection({
  navigation,
  route,
}: CollectionScreenNavigationProp) {
  const { collectionId } = route.params;
  const { data: collection, isLoading } = useCollection(collectionId);
  const tabBarheight = useBottomTabBarHeight();
  const headerHeight = useHeaderHeight();
  const scrollOffset = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(
    (e) => (scrollOffset.value = e.contentOffset.y)
  );

  if (isLoading) return <LoadingScreen />;

  return (
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
      renderItem={({ item }: { item: CollectionDetails["parts"][0] }) => (
        <MoviePoster
          pressHandler={() =>
            navigation.push("Movie", {
              movieId: item.id,
              movieTitle: item.title,
              poster_path: item.poster_path,
            })
          }
          movie={item}
          posterPath={item.poster_path}
          style={{
            width: calculateWidth(16, 16, 2),
            height: calculateWidth(16, 16, 2) * 1.5,
          }}
        />
      )}
      numColumns={2}
      contentContainerStyle={[
        { marginHorizontal: 16 },
        Platform.OS === "ios"
          ? { paddingTop: headerHeight, paddingBottom: tabBarheight }
          : undefined,
      ]}
      columnWrapperStyle={{
        justifyContent: "space-between",
        marginBottom: 16,
      }}
      scrollIndicatorInsets={
        Platform.OS === "ios"
          ? {
              bottom: tabBarheight - 16,
            }
          : undefined
      }
      keyExtractor={(movie: CollectionDetails["parts"][0]) =>
        movie.id.toString()
      }
    />
  );
}
