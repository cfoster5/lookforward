import React, { useContext, useState } from "react";
import {
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
import FastImage from "react-native-fast-image";
import ImageView from "react-native-image-viewing";
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

import TabStackContext from "../../contexts/TabStackContext";
import { dateToLocaleString, getRuntime } from "../../helpers/formatting";
import { reusableStyles } from "../../helpers/styles";
import { useGetMovie } from "../../hooks/useGetMovie";
import { Navigation } from "../../interfaces/navigation";
import {
  Genre,
  Keywords,
  ProductionCompany,
  Recommendation,
} from "../../interfaces/tmdb";
import { BlueBullet } from "../BlueBullet";
import ButtonSingleState from "../ButtonSingleState";
import CategoryControl from "../CategoryControl";
import { LoadingScreen } from "../LoadingScreen";
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

function SlidingMovie({
  navigation,
  movie,
}: {
  navigation: any;
  movie: Recommendation;
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
  const [mediaSelections, setMediaSelections] = useState<{
    videos: "Trailer" | "Teaser";
    images: "posters" | "backdrops";
  }>({
    videos: "Trailer",
    images: "posters",
  });
  const { theme } = useContext(TabStackContext);
  const [showImageViewer, setShowImageViewer] = useState({
    isVisible: false,
    index: 0,
  });

  const scrollHandler = useAnimatedScrollHandler(
    (event) => (scrollOffset.value = event.contentOffset.y)
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
        <Text style={reusableStyles.date}>
          {dateToLocaleString(traktDetails.released)}
        </Text>
        {(getRuntime(movieDetails?.runtime) || traktDetails?.certification) && (
          <View style={{ flexDirection: "row" }}>
            <Text style={reusableStyles.date}>
              {getRuntime(movieDetails?.runtime)}
            </Text>
            {getRuntime(movieDetails?.runtime) &&
              traktDetails?.certification && <BlueBullet />}
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
            <ButtonSingleState
              key={i}
              text={genre.name}
              onPress={() => navigation.push("MovieDiscover", { genre: genre })}
            />
          ))}
        </View>
        <ThemedText style={{ ...iOSUIKit.bodyObject, marginTop: 16 }}>
          Status: {movieDetails?.status}
        </ThemedText>
      </View>
      <CategoryControl
        buttons={["Cast & Crew", "Media", "Discover"]}
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
            {/* <DiscoverListLabel text="Trailers" /> */}
            <View style={{ flexDirection: "row" }}>
              <MediaSelection
                option={"Trailers"}
                action={() =>
                  setMediaSelections({ ...mediaSelections, videos: "Trailer" })
                }
              />
              <MediaSelection
                option={"Teasers"}
                action={() =>
                  setMediaSelections({ ...mediaSelections, videos: "Teaser" })
                }
              />
            </View>
            <FlatList
              keyExtractor={(item) => item.id.toString()}
              data={movieDetails?.videos?.results?.filter(
                (result) => result.type === mediaSelections.videos
              )}
              renderItem={({ item }) => <Trailer video={item} />}
              horizontal={true}
              contentContainerStyle={{
                // marginTop: 16,
                paddingRight: 24,
              }}
              style={{ marginHorizontal: -16, paddingHorizontal: 16 }}
              showsHorizontalScrollIndicator={false}
            />

            <View style={{ flexDirection: "row" }}>
              <MediaSelection
                option={"Posters"}
                action={() =>
                  setMediaSelections({ ...mediaSelections, images: "posters" })
                }
              />
              <MediaSelection
                option={"Backdrops"}
                action={() =>
                  setMediaSelections({
                    ...mediaSelections,
                    images: "backdrops",
                  })
                }
              />
            </View>
            <FlatList
              keyExtractor={(item) => item.file_path}
              data={movieDetails?.images?.[mediaSelections.images]}
              renderItem={({ item, index }) =>
                mediaSelections.images === "posters" ? (
                  <Pressable
                    onPress={() =>
                      setShowImageViewer({ isVisible: true, index: index })
                    }
                  >
                    <FastImage
                      style={{
                        width: Dimensions.get("window").width / 2.5 - 24,
                        height:
                          (Dimensions.get("window").width / 2.5 - 24) * 1.5,
                        marginRight: 8,
                        marginTop: 16,
                        borderWidth: 1,
                        borderColor: theme === "dark" ? "#1f1f1f" : "#e0e0e0",
                        borderRadius: 8,
                      }}
                      source={{
                        uri: `https://image.tmdb.org/t/p/w300${item.file_path}`,
                      }}
                    />
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={() =>
                      setShowImageViewer({ isVisible: true, index: index })
                    }
                  >
                    <FastImage
                      style={{
                        width: Dimensions.get("window").width / 1.5 - 16,
                        height:
                          (180 / 320) *
                          (Dimensions.get("window").width / 1.5 - 16),
                        resizeMode: "cover",
                        borderRadius: 8,
                        marginRight: 8,
                        marginTop: 16,
                        borderWidth: 1,
                        borderColor: theme === "dark" ? "#1f1f1f" : "#e0e0e0",
                      }}
                      source={{
                        uri: `https://image.tmdb.org/t/p/w780${item.file_path}`,
                      }}
                    />
                  </Pressable>
                )
              }
              horizontal={true}
              contentContainerStyle={{
                // marginTop: 16,
                paddingRight: 24,
              }}
              style={{ marginHorizontal: -16, paddingHorizontal: 16 }}
              showsHorizontalScrollIndicator={false}
            />

            {/* {movieDetails?.videos?.results.map((video, i) => (
              <Trailer key={i} video={video} />
            ))}
            <ThemedText>{traktDetails?.trailer}</ThemedText> */}
            {movieDetails?.videos?.results?.length === 0 && (
              <ThemedText style={{ ...iOSUIKit.bodyObject, paddingTop: 16 }}>
                No trailers yet! Come back later!
              </ThemedText>
            )}
            <ImageView
              images={movieDetails?.images?.[mediaSelections.images].map(
                (image) => ({
                  uri: `https://image.tmdb.org/t/p/w780${image.file_path}`,
                })
              )}
              imageIndex={showImageViewer.index}
              visible={showImageViewer.isVisible}
              onRequestClose={() =>
                setShowImageViewer({ isVisible: false, index: 0 })
              }
            />
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
                      <ButtonSingleState
                        text={item.name}
                        onPress={() =>
                          navigation.push("MovieDiscover", { company: item })
                        }
                      />
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
                      <ButtonSingleState
                        text={item.name}
                        onPress={() =>
                          navigation.push("MovieDiscover", { keyword: item })
                        }
                      />
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
                  data={movieDetails?.recommendations.results}
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
    <LoadingScreen />
  );

  function MediaSelection({
    option,
    action,
  }: {
    option: "Trailers" | "Teasers" | "Posters" | "Backdrops";
    action: () => void;
  }) {
    return (
      <Pressable style={{ marginRight: 8 }} onPress={action}>
        <ThemedText
          style={[
            option
              .toLowerCase()
              .includes(mediaSelections.images.toLowerCase()) ||
            option.toLowerCase().includes(mediaSelections.videos.toLowerCase())
              ? iOSUIKit.bodyEmphasized
              : iOSUIKit.body,
            {
              marginTop: 16,
            },
          ]}
        >
          {option}
        </ThemedText>
      </Pressable>
    );
  }
}

const styles = StyleSheet.create({
  backdrop: {
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").width / 1.78,
  },
});
