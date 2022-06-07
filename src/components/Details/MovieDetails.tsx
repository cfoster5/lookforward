import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
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
import { Modalize } from "react-native-modalize";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { iOSColors, iOSUIKit } from "react-native-typography";
import { BlurView } from "@react-native-community/blur";
import {
  BottomTabNavigationProp,
  useBottomTabBarHeight,
} from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";
import { CompositeNavigationProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import TabStackContext from "../../contexts/TabStackContext";
import { dateToLocaleString, getRuntime } from "../../helpers/formatting";
import { calculateWidth, tmdbMovieGenres } from "../../helpers/helpers";
import { reusableStyles } from "../../helpers/styles";
import { useGetMovie } from "../../hooks/useGetMovie";
import { Navigation } from "../../interfaces/navigation";
import { ListLabel } from "../../screens/Search";
import { BlueBullet } from "../BlueBullet";
import ButtonSingleState from "../ButtonSingleState";
import CategoryControl from "../CategoryControl";
import { LoadingScreen } from "../LoadingScreen";
import Person from "../Person";
import { MoviePoster } from "../Posters/MoviePoster";
import { Text as ThemedText } from "../Themed";
import Trailer from "../Trailer";
import WatchProvidersModal from "./WatchProvidersModal";

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

function DiscoverListLabel({ text }: { text: string }) {
  return (
    <Text
      style={[
        iOSUIKit.subheadEmphasized,
        {
          color: iOSColors.gray,
          textAlign: "center",
          marginTop: 16,
        },
      ]}
    >
      {text}
    </Text>
  );
}

function ScrollViewWithFlatList({
  data,
  numColumns,
  navigation,
  navParamKey,
}: {
  data: any;
  numColumns: number;
  navigation: any;
  navParamKey: string;
}) {
  return (
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
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={({ item }) => (
          <ButtonSingleState
            text={item.name}
            onPress={() =>
              navigation.push("MovieDiscover", { [navParamKey]: item })
            }
          />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </ScrollView>
  );
}

export const horizontalListProps = {
  horizontal: true,
  style: { marginHorizontal: -16, marginTop: 16 },
  ListHeaderComponent: () => <View style={{ width: 16 }} />,
  ItemSeparatorComponent: () => <View style={{ width: 8 }} />,
  ListFooterComponent: () => <View style={{ width: 16 }} />,
  showsHorizontalScrollIndicator: false,
};

export function MovieDetails({ navigation, movieId }: Props) {
  const { movieDetails, traktDetails, loading } = useGetMovie(movieId);
  const [detailIndex, setDetailIndex] = useState(0);
  const tabBarheight = useBottomTabBarHeight();
  const headerHeight = useHeaderHeight();
  const [showAllOverview, setShowAllOverview] = useState(false);
  const scrollOffset = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(
    (e) => (scrollOffset.value = e.contentOffset.y)
  );
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

  const providersModalRef = useRef<Modalize>(null);

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

  useEffect(() => {
    if (
      movieDetails?.videos.results.filter((result) => result.type === "Trailer")
        .length === 0
    ) {
      setMediaSelections({ ...mediaSelections, videos: "Teaser" });
    }
  }, [movieDetails?.videos.results]);

  if (loading) return <LoadingScreen />;

  return (
    <>
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
        {movieDetails!.backdrop_path && (
          <AnimatedImageBackground
            style={[styles.backdrop, headerStyle]}
            source={{
              uri: `https://image.tmdb.org/t/p/w780${
                movieDetails!.backdrop_path
              }`,
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
        <View style={{ margin: 16 }}>
          <ThemedText style={iOSUIKit.largeTitleEmphasized}>
            {movieDetails!.title}
          </ThemedText>
          <View style={{ flexDirection: "row" }}>
            <Text style={reusableStyles.date}>
              {traktDetails?.released
                ? dateToLocaleString(traktDetails.released)
                : "No release date yet"}
            </Text>
            <BlueBullet />
            <Text style={reusableStyles.date}>{movieDetails!.status}</Text>
          </View>

          {(getRuntime(movieDetails!.runtime) ||
            traktDetails?.certification) && (
            <View style={{ flexDirection: "row" }}>
              <Text style={reusableStyles.date}>
                {getRuntime(movieDetails!.runtime)}
              </Text>
              {getRuntime(movieDetails!.runtime) &&
                traktDetails?.certification && <BlueBullet />}
              <Text style={reusableStyles.date}>
                {traktDetails?.certification}
              </Text>
            </View>
          )}

          {movieDetails!.tagline ? (
            <Text
              style={[
                iOSUIKit.body,
                { paddingTop: 16, fontStyle: "italic", color: iOSColors.gray },
              ]}
            >
              {movieDetails!.tagline}
            </Text>
          ) : null}

          <Pressable onPress={() => setShowAllOverview(!showAllOverview)}>
            <ThemedText
              style={[iOSUIKit.body, { paddingTop: 16 }]}
              numberOfLines={showAllOverview ? undefined : 4}
            >
              {movieDetails!.overview}
            </ThemedText>
          </Pressable>

          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {movieDetails!.genres.map((genre, index) => (
              <ButtonSingleState
                key={index}
                text={genre.name}
                onPress={() =>
                  navigation.push("MovieDiscover", { genre: genre })
                }
                buttonStyle={{ paddingHorizontal: 16, flexDirection: "row" }}
                icon={tmdbMovieGenres.find((obj) => obj.id === genre.id)?.icon}
                textStyle={{ alignSelf: "center" }}
              />
            ))}
          </View>

          {(movieDetails!["watch/providers"].results.US?.flatrate?.length > 0 ||
            movieDetails!["watch/providers"].results.US?.rent?.length > 0 ||
            movieDetails!["watch/providers"].results.US?.buy?.length > 0) && (
            <>
              <View
                style={{
                  marginTop: 16,
                  flexDirection: "row",
                  flexWrap: "nowrap",
                  justifyContent: "space-between",
                }}
              >
                <ListLabel text="Watch on" style={{ marginBottom: 0 }} />
                <Pressable onPress={() => providersModalRef.current?.open()}>
                  <Text
                    style={[iOSUIKit.bodyEmphasized, { color: iOSColors.blue }]}
                  >
                    More
                  </Text>
                </Pressable>
              </View>

              <FlatList
                // unique list of objects by key
                // https://stackoverflow.com/a/56768137/5648619
                // .concat() would not work if first array was undefined
                // https://stackoverflow.com/a/51992342/5648619
                data={[
                  ...new Map(
                    [
                      ...(movieDetails!["watch/providers"].results.US
                        ?.flatrate || []),
                      ...(movieDetails!["watch/providers"].results.US?.rent ||
                        []),
                      ...(movieDetails!["watch/providers"].results.US?.buy ||
                        []),
                    ].map((item, key) => [item["provider_id"], item])
                  ).values(),
                ]}
                renderItem={({ item }) => (
                  <Image
                    source={{
                      uri: `https://image.tmdb.org/t/p/w154${item.logo_path}`,
                    }}
                    style={{
                      height: calculateWidth(16, 8, 6),
                      width: calculateWidth(16, 8, 6),
                      borderWidth: 1,
                      borderColor: theme === "dark" ? "#1f1f1f" : "#e0e0e0",
                      borderRadius: 8,
                    }}
                  />
                )}
                {...horizontalListProps}
                scrollEnabled={false}
              />
            </>
          )}

          {/*  */}
        </View>
        <CategoryControl
          buttons={["Cast & Crew", "Media", "Discover"]}
          categoryIndex={detailIndex}
          handleCategoryChange={(index: number) => setDetailIndex(index)}
        />
        <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
          {detailIndex === 0 && (
            <View>
              {movieDetails!.credits.crew
                ?.filter((person) => person.job === "Director")
                .map((person, i) => (
                  <Person key={i} navigation={navigation} person={person} />
                ))}
              {movieDetails!.credits.cast.map((person, i) => (
                <Person key={i} navigation={navigation} person={person} />
              ))}
            </View>
          )}
          {detailIndex === 1 && (
            <View>
              {/* <DiscoverListLabel text="Trailers" /> */}
              {movieDetails!.videos.results.filter(
                (result) =>
                  result.type === "Trailer" || result.type === "Teaser"
              ).length > 0 ? (
                <>
                  <View style={{ flexDirection: "row" }}>
                    {movieDetails!.videos.results.filter(
                      (result) => result.type === "Trailer"
                    ).length > 0 && (
                      <MediaSelection
                        option={"Trailers"}
                        action={() =>
                          setMediaSelections({
                            ...mediaSelections,
                            videos: "Trailer",
                          })
                        }
                      />
                    )}
                    {movieDetails!.videos.results.filter(
                      (result) => result.type === "Teaser"
                    ).length > 0 && (
                      <MediaSelection
                        option={"Teasers"}
                        action={() =>
                          setMediaSelections({
                            ...mediaSelections,
                            videos: "Teaser",
                          })
                        }
                      />
                    )}
                  </View>
                  <FlatList
                    keyExtractor={(item) => item.id}
                    data={movieDetails!.videos.results.filter(
                      (result) => result.type === mediaSelections.videos
                    )}
                    renderItem={({ item }) => <Trailer video={item} />}
                    {...horizontalListProps}
                  />
                </>
              ) : (
                <ThemedText style={[iOSUIKit.body, { paddingTop: 16 }]}>
                  No trailers yet! Come back later!
                </ThemedText>
              )}

              <View style={{ flexDirection: "row" }}>
                {movieDetails!.images.posters.length > 0 && (
                  <MediaSelection
                    option={"Posters"}
                    action={() =>
                      setMediaSelections({
                        ...mediaSelections,
                        images: "posters",
                      })
                    }
                  />
                )}
                {movieDetails!.images.backdrops.length > 0 && (
                  <MediaSelection
                    option={"Backdrops"}
                    action={() =>
                      setMediaSelections({
                        ...mediaSelections,
                        images: "backdrops",
                      })
                    }
                  />
                )}
              </View>
              <FlatList
                keyExtractor={(item) => item.file_path}
                data={movieDetails!.images[mediaSelections.images]}
                renderItem={({ item, index }) => (
                  <Pressable
                    onPress={() =>
                      setShowImageViewer({ isVisible: true, index: index })
                    }
                  >
                    <FastImage
                      style={{
                        width:
                          mediaSelections.images === "posters"
                            ? calculateWidth(16, 8, 2.5)
                            : calculateWidth(16, 8, 1.5),
                        height:
                          mediaSelections.images === "posters"
                            ? calculateWidth(16, 8, 2.5) * 1.5
                            : calculateWidth(16, 8, 1.5) / 1.78,
                        borderWidth: 1,
                        borderColor: theme === "dark" ? "#1f1f1f" : "#e0e0e0",
                        borderRadius: 8,
                      }}
                      source={{
                        uri:
                          mediaSelections.images === "posters"
                            ? `https://image.tmdb.org/t/p/w300${item.file_path}`
                            : `https://image.tmdb.org/t/p/w780${item.file_path}`,
                      }}
                    />
                  </Pressable>
                )}
                {...horizontalListProps}
              />
            </View>
          )}
          {detailIndex === 2 && (
            <>
              {movieDetails!.production_companies.length > 0 && (
                <>
                  <DiscoverListLabel text="Production" />
                  <ScrollViewWithFlatList
                    data={movieDetails!.production_companies}
                    numColumns={
                      movieDetails!.production_companies.length > 2
                        ? Math.ceil(
                            movieDetails!.production_companies.length / 2
                          )
                        : 2
                    }
                    navigation={navigation}
                    navParamKey={"company"}
                  />
                </>
              )}
              {movieDetails!.keywords.keywords.length > 0 && (
                <>
                  <DiscoverListLabel text="Keywords" />
                  <ScrollViewWithFlatList
                    data={movieDetails!.keywords.keywords}
                    numColumns={Math.ceil(
                      movieDetails!.keywords.keywords.length / 2
                    )}
                    navigation={navigation}
                    navParamKey={"keyword"}
                  />
                </>
              )}

              {movieDetails!.belongs_to_collection && (
                <>
                  <DiscoverListLabel text="Collection" />
                  <Pressable
                    onPress={() =>
                      navigation.push("Collection", {
                        collectionId: movieDetails!.belongs_to_collection?.id,
                      })
                    }
                    style={{
                      marginTop: 16,
                      borderTopRightRadius: 8,
                      borderTopLeftRadius: 8,
                      overflow: "hidden",
                    }}
                  >
                    <FastImage
                      style={{
                        width: Dimensions.get("screen").width - 32,
                        height: (Dimensions.get("screen").width - 32) / 1.78,
                        borderWidth: 1,
                        borderColor: theme === "dark" ? "#1f1f1f" : "#e0e0e0",
                        borderRadius: 8,
                      }}
                      source={{
                        uri: `https://image.tmdb.org/t/p/w780${
                          movieDetails!.belongs_to_collection.backdrop_path
                        }`,
                      }}
                    />
                    <BlurView
                      style={{
                        position: "absolute",
                        ...reusableStyles.inset,
                        bottom:
                          // use lineHeight to account for font size + space above/below
                          (Dimensions.get("screen").width - 32) / 1.78 -
                          iOSUIKit.bodyObject.lineHeight -
                          16,
                      }}
                    />
                    <ThemedText
                      style={[
                        iOSUIKit.body,
                        { margin: 8, position: "absolute" },
                      ]}
                    >
                      {movieDetails!.belongs_to_collection.name}
                    </ThemedText>
                  </Pressable>

                  {/* <Text
                    style={[
                      iOSUIKit.body,
                      {
                        paddingTop: 16,
                        fontStyle: "italic",
                        color: iOSColors.gray,
                      },
                    ]}
                  >
                    {JSON.stringify(movieDetails!.belongs_to_collection)}
                  </Text> */}
                </>
              )}

              {movieDetails!.recommendations.results.length > 0 && (
                <>
                  <DiscoverListLabel text="Recommended" />
                  <FlatList
                    keyExtractor={(item) => item.id.toString()}
                    data={movieDetails!.recommendations.results}
                    renderItem={({ item }) => (
                      <Pressable
                        onPress={() =>
                          navigation.push("Movie", { movie: item })
                        }
                      >
                        <MoviePoster
                          movie={item}
                          style={{
                            width: calculateWidth(16, 8, 2.5),
                            height: calculateWidth(16, 8, 2.5) * 1.5,
                          }}
                        />
                      </Pressable>
                    )}
                    {...horizontalListProps}
                  />
                </>
              )}
            </>
          )}
        </View>
      </Animated.ScrollView>
      <ImageView
        images={movieDetails!.images[mediaSelections.images].map((image) => ({
          uri: `https://image.tmdb.org/t/p/w780${image.file_path}`,
        }))}
        imageIndex={showImageViewer.index}
        visible={showImageViewer.isVisible}
        onRequestClose={() =>
          setShowImageViewer({ isVisible: false, index: 0 })
        }
      />
      <WatchProvidersModal
        modalRef={providersModalRef}
        providers={movieDetails!["watch/providers"].results.US}
      />
    </>
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
        <Text
          style={[
            option
              .toLowerCase()
              .includes(mediaSelections.images.toLowerCase()) ||
            option.toLowerCase().includes(mediaSelections.videos.toLowerCase())
              ? iOSUIKit.bodyEmphasizedWhite
              : { ...iOSUIKit.bodyObject, color: iOSColors.gray },
            {
              marginTop: 16,
            },
          ]}
        >
          {option}
        </Text>
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
