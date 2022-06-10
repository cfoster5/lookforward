import React, { useLayoutEffect, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
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

import { ExpandableText } from "../components/ExpandableText";
import { LoadingScreen } from "../components/LoadingScreen";
import { MoviePoster } from "../components/Posters/MoviePoster";
import { Text as ThemedText } from "../components/Themed";
import { reusableStyles } from "../helpers/styles";
import { useGetCollection } from "../hooks/useGetCollection";
import { Navigation } from "../interfaces/navigation";

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

const AnimatedImageBackground =
  Animated.createAnimatedComponent(ImageBackground);

export const horizontalListProps = {
  horizontal: true,
  style: { marginHorizontal: -16, marginTop: 16 },
  ListHeaderComponent: () => <View style={{ width: 16 }} />,
  ItemSeparatorComponent: () => <View style={{ width: 8 }} />,
  ListFooterComponent: () => <View style={{ width: 16 }} />,
  showsHorizontalScrollIndicator: false,
};

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

  const headerStyle = useAnimatedStyle(() => {
    return {
      // opacity:
      //   scrollOffset.value < 0
      //     ? 2 -
      //       (styles.backdrop.height + Math.abs(scrollOffset.value)) /
      //         styles.backdrop.height
      //     : 1,
      transform: [
        {
          scale:
            scrollOffset.value < 0
              ? (styles.backdrop.height + Math.abs(scrollOffset.value)) /
                styles.backdrop.height
              : 1,
        },
        {
          translateY: interpolate(
            scrollOffset.value,
            [scrollOffset.value, 0],
            [
              // No idea why this math is working but after dividing the scale by 2, this looks perfect
              // Could 2 be the key because I'm spreading the height on two sides?
              scrollOffset.value /
                ((styles.backdrop.height + Math.abs(scrollOffset.value)) /
                  styles.backdrop.height) /
                2,
              0,
            ]
          ),
        },
      ],
    };
  });

  useLayoutEffect(() => {
    navigation.setOptions({ title: collection?.name });
  }, [collection]);

  if (loading) return <LoadingScreen />;

  return (
    <Animated.ScrollView
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      contentContainerStyle={
        Platform.OS === "ios"
          ? { paddingTop: headerHeight, paddingBottom: tabBarheight }
          : undefined
      }
      scrollIndicatorInsets={
        Platform.OS === "ios"
          ? {
              bottom: tabBarheight - 16,
            }
          : undefined
      }
    >
      {collection!.backdrop_path && (
        <AnimatedImageBackground
          style={[styles.backdrop, headerStyle]}
          source={{
            uri: `https://image.tmdb.org/t/p/w780${collection!.backdrop_path}`,
          }}
        >
          <LinearGradient
            colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 1)"]}
            start={{ x: 0, y: 0.8 }}
            end={{ x: 0, y: 1.0 }}
            style={[
              {
                position: "absolute",
              },
              reusableStyles.inset,
            ]}
          />
        </AnimatedImageBackground>
      )}

      <View style={{ margin: 16, marginBottom: 0 }}>
        <View>
          <ThemedText style={iOSUIKit.largeTitleEmphasized}>
            {collection!.name}
          </ThemedText>

          <ExpandableText
            isExpanded={showAllOverview}
            pressHandler={() => setShowAllOverview(!showAllOverview)}
            text={collection!.overview}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            marginTop: 16,
          }}
        >
          {collection!.parts.map((movie, index) => (
            <Pressable
              key={index}
              style={{ marginBottom: 16 }}
              onPress={() =>
                navigation.push("Movie", {
                  movieId: movie.id,
                  movieTitle: movie.title,
                })
              }
            >
              <MoviePoster movie={movie} />
            </Pressable>
          ))}
        </View>
      </View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").width / 1.78,
  },
});
