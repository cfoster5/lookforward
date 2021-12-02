import React, { useContext, useEffect, useState } from "react";
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
import { Image } from "react-native-elements";
import FastImage from "react-native-fast-image";
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

import TabStackContext from "../../contexts/TabStackContext";
import { months } from "../../helpers/helpers";
import { reusableStyles } from "../../helpers/styles";
import { getMovieDetails } from "../../helpers/tmdbRequests";
import { getMovieById, getRelated } from "../../helpers/traktRequests";
import { Navigation } from "../../interfaces/navigation";
import {
  Genre,
  Keyword,
  Movie,
  MovieDetail,
  ProductionCompany,
} from "../../interfaces/tmdb";
import ButtonSingleState from "../ButtonSingleState";
import CategoryControl from "../CategoryControl";
import Person from "../Person";
import { TextPoster } from "../Poster";
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
  movie: Movie;
}

function DiscoverButton({
  navigation,
  genre,
  company,
  keyword,
}: {
  navigation: any;
  genre?: Genre;
  company?: ProductionCompany;
  keyword?: Keyword;
}) {
  let obj: Genre | ProductionCompany | Keyword = {
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
  movie: Movie;
}) {
  return (
    <Pressable
      style={{ marginRight: 16 }}
      onPress={() => navigation.push("Details", { data: movie, type: "movie" })}
    >
      {movie.poster_path ? (
        <FastImage
          style={{
            // I don't know why 18 works here to center the right-most image but it works on every iOS device tested
            width: Dimensions.get("window").width / 2.5 - 18,
            height: (Dimensions.get("window").width / 2.5 - 18) * 1.5,
            borderRadius: 8,
            marginBottom: 0,
          }}
          source={{
            uri: `https://image.tmdb.org/t/p/w300${movie.poster_path}`,
          }}
        />
      ) : (
        <TextPoster text={movie.title} />
      )}
    </Pressable>
  );
}

export function MovieDetails({ navigation, movie }: Props) {
  const [movieDetails, setMovieDetails] = useState<MovieDetail>();
  const [detailIndex, setDetailIndex] = useState(0);
  const { theme } = useContext(TabStackContext);
  const tabBarheight = useBottomTabBarHeight();
  const headerHeight = useHeaderHeight();
  const [showAllOverview, setShowAllOverview] = useState(false);
  const [traktDetails, setTraktDetails] = useState();
  const scrollOffset = useSharedValue(0);

  useEffect(() => {
    setMovieDetails(undefined);
    setTraktDetails(undefined);
    getMovieDetails(movie.id).then((movie) => {
      console.log(`movie`, movie);
      setMovieDetails(movie);
    });
  }, [movie]);

  useEffect(() => {
    if (movieDetails?.imdb_id) {
      getMovieById(movieDetails.imdb_id).then((json) => {
        // console.log(`trakt json`, json)
        setTraktDetails(json);
      });
    }
  }, [movieDetails]);

  function getReleaseDate(): string | undefined {
    if (movie.release_date) {
      let monthIndex = new Date(movie.release_date)?.getUTCMonth();
      return `${months[monthIndex]?.toUpperCase()} ${new Date(
        movie.release_date
      )?.getUTCDate()}, ${new Date(movie.release_date)?.getUTCFullYear()}`;
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

  const AnimatedImageBackground =
    Animated.createAnimatedComponent(ImageBackground);

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

  return (
    <>
      {movieDetails ? (
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
          {movie?.backdrop_path && (
            <AnimatedImageBackground
              style={[styles.backdrop, headerStyle]}
              source={{
                uri: `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`,
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
            <Text
              style={
                theme === "dark"
                  ? iOSUIKit.largeTitleEmphasizedWhite
                  : iOSUIKit.largeTitleEmphasized
              }
            >
              {movie.title}
            </Text>
            <Text style={reusableStyles.date}>{getReleaseDate()}</Text>
            {(getRuntime() || traktDetails?.certification) && (
              <View style={{ flexDirection: "row" }}>
                <Text style={reusableStyles.date}>{getRuntime()}</Text>
                {getRuntime() && traktDetails?.certification && (
                  <View
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: 5,
                      marginHorizontal: 5,
                      backgroundColor: iOSColors.blue,
                      alignSelf: "center",
                    }}
                  />
                )}
                <Text style={reusableStyles.date}>
                  {traktDetails?.certification}
                </Text>
              </View>
            )}

            <Pressable onPress={() => setShowAllOverview(!showAllOverview)}>
              <Text
                style={
                  theme === "dark"
                    ? { ...iOSUIKit.bodyWhiteObject, paddingTop: 16 }
                    : { ...iOSUIKit.bodyObject, paddingTop: 16 }
                }
                numberOfLines={showAllOverview ? undefined : 4}
              >
                {movie.overview}
              </Text>
            </Pressable>

            {/* <Text style={theme === "dark" ? { ...iOSUIKit.bodyWhiteObject, paddingTop: 16 } : { ...iOSUIKit.bodyObject, paddingTop: 16 }}>{movie.overview}</Text> */}
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {movieDetails?.genres?.map((genre, i) => (
                <DiscoverButton key={i} navigation={navigation} genre={genre} />
              ))}
            </View>
            <Text
              style={
                theme === "dark"
                  ? { ...iOSUIKit.bodyWhiteObject, marginTop: 16 }
                  : { ...iOSUIKit.bodyObject }
              }
            >
              Status: {movieDetails?.status}
            </Text>
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
                  <Text
                    style={
                      theme === "dark"
                        ? { ...iOSUIKit.bodyWhiteObject, paddingTop: 16 }
                        : { ...iOSUIKit.bodyObject, paddingTop: 16 }
                    }
                  >
                    No trailers yet! Come back later!
                  </Text>
                )}
              </View>
            )}
            {detailIndex === 2 && (
              <>
                {movieDetails?.production_companies.length > 0 && (
                  <>
                    <Text
                      style={
                        theme === "dark"
                          ? {
                              ...iOSUIKit.subheadEmphasizedWhiteObject,
                              color: iOSColors.gray,
                              textAlign: "center",
                              marginTop: 16,
                            }
                          : { ...iOSUIKit.bodyObject }
                      }
                    >
                      Production
                    </Text>
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
                          <DiscoverButton
                            navigation={navigation}
                            company={item}
                          />
                        )}
                        keyExtractor={(item) => item.id.toString()}
                      />
                    </ScrollView>
                  </>
                )}
                {movieDetails?.keywords?.keywords.length > 0 && (
                  <>
                    <Text
                      style={
                        theme === "dark"
                          ? {
                              ...iOSUIKit.subheadEmphasizedWhiteObject,
                              color: iOSColors.gray,
                              textAlign: "center",
                              marginTop: 16,
                            }
                          : { ...iOSUIKit.bodyObject }
                      }
                    >
                      Keywords
                    </Text>
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
                          <DiscoverButton
                            navigation={navigation}
                            keyword={item}
                          />
                        )}
                        keyExtractor={(item) => item.id.toString()}
                      />
                    </ScrollView>
                  </>
                )}
                {movieDetails.recommendations.results.length > 0 && (
                  <>
                    <Text
                      style={
                        theme === "dark"
                          ? {
                              ...iOSUIKit.subheadEmphasizedWhiteObject,
                              color: iOSColors.gray,
                              textAlign: "center",
                              marginTop: 16,
                            }
                          : { ...iOSUIKit.bodyObject }
                      }
                    >
                      Recommended
                    </Text>
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
      )}
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").width / 1.78,
  },
});
