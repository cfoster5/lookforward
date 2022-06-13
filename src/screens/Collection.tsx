import React, { useLayoutEffect, useState } from "react";
import { Platform, View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { iOSUIKit } from "react-native-typography";
import {
  BottomTabNavigationProp,
  useBottomTabBarHeight,
} from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";
import { CompositeNavigationProp, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { AnimatedHeaderImage } from "../components/AnimatedHeaderImage";
import { ExpandableText } from "../components/ExpandableText";
import { LoadingScreen } from "../components/LoadingScreen";
import { MoviePoster } from "../components/Posters/MoviePoster";
import { Text as ThemedText } from "../components/Themed";
import { calculateWidth } from "../helpers/helpers";
import { useGetCollection } from "../hooks/useGetCollection";
import { Navigation } from "../interfaces/navigation";
import { CollectionDetails } from "../interfaces/tmdb";

interface Props {
  navigation:
    | CompositeNavigationProp<
        StackNavigationProp<Navigation.FindStackParamList, "Collection">,
        BottomTabNavigationProp<Navigation.TabNavigationParamList, "FindTab">
      >
    | CompositeNavigationProp<
        StackNavigationProp<Navigation.CountdownStackParamList, "Collection">,
        BottomTabNavigationProp<
          Navigation.TabNavigationParamList,
          "CountdownTab"
        >
      >;
  route: RouteProp<
    Navigation.FindStackParamList | Navigation.CountdownStackParamList,
    "Collection"
  >;
}

export function Collection({ navigation, route }: Props) {
  const { collectionId } = route.params;
  const { collection, loading } = useGetCollection(collectionId);
  const tabBarheight = useBottomTabBarHeight();
  const headerHeight = useHeaderHeight();
  const [showAllOverview, setShowAllOverview] = useState(false);
  const scrollOffset = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(
    (e) => (scrollOffset.value = e.contentOffset.y)
  );

  useLayoutEffect(() => {
    navigation.setOptions({ title: collection?.name });
  }, [collection]);

  if (loading) return <LoadingScreen />;

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
          <ExpandableText
            isExpanded={showAllOverview}
            pressHandler={() => setShowAllOverview(!showAllOverview)}
            text={collection!.overview}
          />
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
