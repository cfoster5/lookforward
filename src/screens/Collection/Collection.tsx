import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useLayoutEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { iOSUIKit } from "react-native-typography";
import { DetailedCollection } from "tmdb-ts";

import { useCollection } from "./api/getCollection";

import { AnimatedHeaderImage } from "@/components/AnimatedHeaderImage";
import { ExpandableText } from "@/components/ExpandableText";
import { DynamicShareHeader } from "@/components/Headers";
import { LoadingScreen } from "@/components/LoadingScreen";
import { MoviePoster } from "@/components/Posters/MoviePoster";
import { Text as ThemedText } from "@/components/Themed";
import { calculateWidth } from "@/helpers/helpers";
import { FindStackParams, BottomTabParams } from "@/types";
import { useBottomTabOverflow } from "@/utils/useBottomTabOverflow";

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
  const paddingBottom = useBottomTabOverflow();
  const scrollOffset = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(
    (e) => (scrollOffset.value = e.contentOffset.y),
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <DynamicShareHeader
          title={collection?.name}
          urlSegment={`collection/${collectionId}?name=${collection?.name}`}
        />
      ),
    });
  }, [collection?.name, navigation, collectionId]);

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
      renderItem={({ item }: { item: DetailedCollection["parts"][number] }) => (
        <MoviePoster
          pressHandler={() =>
            navigation.push("Movie", {
              movieId: item.id,
              name: item.title,
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
      contentContainerStyle={{
        marginHorizontal: 16,
      }}
      automaticallyAdjustsScrollIndicatorInsets
      contentInsetAdjustmentBehavior="automatic"
      contentInset={{ bottom: paddingBottom }}
      scrollIndicatorInsets={{ bottom: paddingBottom }}
      columnWrapperStyle={{
        justifyContent: "space-between",
        marginBottom: 16,
      }}
      keyExtractor={(movie: DetailedCollection["parts"][number]) =>
        movie.id.toString()
      }
    />
  );
}
