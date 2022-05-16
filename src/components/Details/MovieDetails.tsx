import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { iOSColors, iOSUIKit } from "react-native-typography";
import {
  BottomTabNavigationProp,
  useBottomTabBarHeight,
} from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";
import { CompositeNavigationProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { DateTime } from "luxon";

import { reusableStyles } from "../../helpers/styles";
import { useGetMovie } from "../../hooks/useGetMovie";
import { Navigation } from "../../interfaces/navigation";
import { TMDB } from "../../interfaces/tmdb";
import { BlueBullet } from "../BlueBullet";
import ButtonSingleState from "../ButtonSingleState";
import CategoryControl from "../CategoryControl";
import Person from "../Person";
import { MoviePoster } from "../Posters/MoviePoster";
import { Text as ThemedText } from "../Themed";
import Trailer from "../Trailer";

interface Props {
  navigation:
    | CompositeNavigationProp<
        StackNavigationProp<Navigation.FindStackParamList, "Details">,
        BottomTabNavigationProp<Navigation.TabNavigationParamList, "FindTab">
      >
    | CompositeNavigationProp<
        StackNavigationProp<Navigation.CountdownStackParamList, "Details">,
        BottomTabNavigationProp<
          Navigation.TabNavigationParamList,
          "CountdownTab"
        >
      >;
  movieId: number;
}

const AnimatedImageBackground =
  Animated.createAnimatedComponent(ImageBackground);

function DiscoverButton({
  navigation,
  genre,
  company,
  keyword,
}: {
  navigation: any;
  genre?: TMDB.Genre;
  company?: TMDB.ProductionCompany;
  keyword?: TMDB.Keyword;
}) {
  let obj: TMDB.Genre | TMDB.ProductionCompany | TMDB.Keyword = {
    id: 0,
    name: "",
  };
  let key = "";
  if (genre) {
    obj = genre;
    key = "genre";
  } else if (company) {
    obj = company;
    key = "company";
  } else if (keyword) {
    obj = keyword;
    key = "keyword";
  }

  return (
    <ButtonSingleState
      text={obj.name}
      onPress={() => navigation.push("MovieDiscover", { [key]: obj })}
    />
  );
}

function SlidingMovie({
  navigation,
  movie,
}: {
  navigation: any;
  movie: TMDB.BaseMovie;
}) {
  return (
    <Pressable
      style={{ marginRight: 16 }}
      onPress={() => navigation.push("Movie", { movie: movie })}
    >
      <MoviePoster
        movie={movie}
        style={{
          // I don't know why 18 works here to center the right-most image but it works on every iOS device tested
          width: Dimensions.get("window").width / 2.5 - 18,
          height: (Dimensions.get("window").width / 2.5 - 18) * 1.5,
        }}
      />
    </Pressable>
  );
}

function DiscoverListLabel({ text }: { text: string }) {
  return (
    <Text
      style={{
        ...iOSUIKit.subheadEmphasizedObject,
        color: iOSColors.gray,
        textAlign: "center",
        marginTop: 16,
      }}
    >
      {text}
    </Text>
  );
}

export function MovieDetails({ navigation, movieId }: Props) {
  const { movieDetails, traktDetails, loading } = useGetMovie(movieId);
  const [detailIndex, setDetailIndex] = useState(0);
  const tabBarheight = useBottomTabBarHeight();
  const headerHeight = useHeaderHeight();
  const [showAllOverview, setShowAllOverview] = useState(false);
  const scrollOffset = useSharedValue(0);

  function getReleaseDate(): string {
    if (traktDetails?.released) {
      return DateTime.fromFormat(traktDetails.released, "yyyy-MM-dd")
        .toFormat("MMMM d, yyyy")
        .toUpperCase();
    } else {
      return "No release date yet";
    }
  }

  function getRuntime(): string | undefined {
    if (movieDetails?.runtime) {
      let minutes = movieDetails?.runtime % 60;
      let hours = (movieDetails?.runtime - minutes) / 60;
      return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    }
  }

  const scrollHandler = useAnimatedScrollHandler(
    (event) => (scrollOffset.value = event.contentOffset.y)
  );

  const windowHeight = Dimensions.get("window").height;

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

  return !loading ? (
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
      showsVerticalScrollIndicator={detailIndex !== 2}
    >
      {movieDetails?.backdrop_path && (
        <AnimatedImageBackground
          style={[styles.backdrop, headerStyle]}
          source={{
            uri: `https://image.tmdb.org/t/p/w780${movieDetails.backdrop_path}`,
          }}
        >
          <LinearGradient
            colors={[
              // "rgba(0, 0, 0, .5)",
              // "rgba(0, 0, 0, 0)",
              "rgba(0, 0, 0, 0)",
              "rgba(0, 0, 0, 1)",
            ]}
            // start={{ x: 0, y: 0 }}
            start={{ x: 0, y: 0.8 }}
            end={{ x: 0, y: 1.0 }}
            // locations={[0.0, insets.top / styles.backdrop.height, 0.8, 1]}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}
          />
        </AnimatedImageBackground>
      )}
      <View style={{ margin: 16 }}>
        <ThemedText style={iOSUIKit.largeTitleEmphasized}>
          {movieDetails?.title}
        </ThemedText>
        <Text style={reusableStyles.date}>{getReleaseDate()}</Text>
        {(getRuntime() || traktDetails?.certification) && (
          <View style={{ flexDirection: "row" }}>
            <Text style={reusableStyles.date}>{getRuntime()}</Text>
            {getRuntime() && traktDetails?.certification && <BlueBullet />}
            <Text style={reusableStyles.date}>
              {traktDetails?.certification}
            </Text>
          </View>
        )}

        <Pressable onPress={() => setShowAllOverview(!showAllOverview)}>
          <ThemedText
            style={{ ...iOSUIKit.bodyObject, paddingTop: 16 }}
            numberOfLines={showAllOverview ? undefined : 4}
          >
            {movieDetails?.overview}
          </ThemedText>
        </Pressable>

        {/* <ThemedText style={theme === "dark" ? { ...iOSUIKit.bodyWhiteObject, paddingTop: 16 } : { ...iOSUIKit.bodyObject, paddingTop: 16 }}>{movie.overview}</ThemedText> */}
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {movieDetails?.genres?.map((genre, i) => (
            <DiscoverButton key={i} navigation={navigation} genre={genre} />
          ))}
        </View>
        <ThemedText style={{ ...iOSUIKit.bodyObject, marginTop: 16 }}>
          Status: {movieDetails?.status}
        </ThemedText>
      </View>
      <CategoryControl
        buttons={["Cast & Crew", "Trailers", "Discover"]}
        categoryIndex={detailIndex}
        handleCategoryChange={(index: number) => setDetailIndex(index)}
      />
      <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
        {detailIndex === 0 && (
          <View>
            {movieDetails?.credits?.crew
              ?.filter((person) => person?.job === "Director")
              .map((person, i) => (
                <Person key={i} navigation={navigation} person={person} />
              ))}
            {movieDetails?.credits.cast.map((person, i) => (
              <Person key={i} navigation={navigation} person={person} />
            ))}
          </View>
        )}
        {detailIndex === 1 && (
          <View>
            {movieDetails?.videos?.results?.map((video, i) => (
              <Trailer key={i} video={video} index={i} />
            ))}
            {movieDetails?.videos?.results?.length === 0 && (
              <ThemedText style={{ ...iOSUIKit.bodyObject, paddingTop: 16 }}>
                No trailers yet! Come back later!
              </ThemedText>
            )}
          </View>
        )}
        {detailIndex === 2 && (
          <>
            {movieDetails?.production_companies.length > 0 && (
              <>
                <DiscoverListLabel text="Production" />
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingRight: 16 }}
                  style={{ marginHorizontal: -16 }}
                >
                  <FlatList
                    contentContainerStyle={{
                      alignSelf: "flex-start",
                      paddingLeft: 16,
                      paddingRight: 8,
                    }}
                    scrollEnabled={false}
                    numColumns={
                      movieDetails?.production_companies.length > 2
                        ? Math.ceil(
                            movieDetails?.production_companies.length / 2
                          )
                        : 2
                    }
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    data={movieDetails?.production_companies}
                    renderItem={({ item }) => (
                      <DiscoverButton navigation={navigation} company={item} />
                    )}
                    keyExtractor={(item) => item.id.toString()}
                  />
                </ScrollView>
              </>
            )}
            {movieDetails?.keywords?.keywords.length > 0 && (
              <>
                <DiscoverListLabel text="Keywords" />
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingRight: 16 }}
                  style={{ marginHorizontal: -16 }}
                >
                  <FlatList
                    contentContainerStyle={{
                      alignSelf: "flex-start",
                      paddingLeft: 16,
                      paddingRight: 8,
                    }}
                    scrollEnabled={false}
                    numColumns={Math.ceil(
                      movieDetails?.keywords?.keywords.length / 2
                    )}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    data={movieDetails?.keywords?.keywords}
                    renderItem={({ item }) => (
                      <DiscoverButton navigation={navigation} keyword={item} />
                    )}
                    keyExtractor={(item) => item.id.toString()}
                  />
                </ScrollView>
              </>
            )}
            {movieDetails?.recommendations?.results?.length > 0 && (
              <>
                <DiscoverListLabel text="Recommended" />
                <FlatList
                  keyExtractor={(item) => item.id.toString()}
                  data={movieDetails.recommendations.results}
                  renderItem={({ item }) => (
                    <SlidingMovie navigation={navigation} movie={item} />
                  )}
                  horizontal={true}
                  contentContainerStyle={{
                    marginTop: 16,
                    paddingRight: 16,
                  }}
                  style={{ marginHorizontal: -16, paddingHorizontal: 16 }}
                  showsHorizontalScrollIndicator={false}
                />
              </>
            )}
          </>
        )}
      </View>
    </Animated.ScrollView>
  ) : (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").width / 1.78,
  },
});
