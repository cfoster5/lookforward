import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { BlurView } from "@react-native-community/blur";
import {
  BottomTabScreenProps,
  useBottomTabBarHeight,
} from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Image } from "expo-image";
import { DateTime } from "luxon";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Platform,
  PlatformColor,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ImageView from "react-native-image-viewing";
import { useMMKVString } from "react-native-mmkv";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { iOSUIKit } from "react-native-typography";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import { useMovie } from "./api/getMovie";
import { useMovieRatings } from "./api/getMovieRatings";
import { useTraktMovie } from "./api/getTraktMovie";
import { DiscoverListLabel } from "./components/DiscoverListLabel";
import { MediaSelection } from "./components/MediaSelection";
import Person from "./components/Person";
import { Rating } from "./components/Rating";
import WatchProvidersModal from "./components/WatchProvidersModal";
import { horizontalListProps } from "./constants/horizontalListProps";
import { composeRuntime } from "./utils/composeRuntime";
import {
  calculateWidth,
  removeSub,
  subToMovie,
  tmdbMovieGenres,
} from "../../helpers/helpers";
import { FirestoreMovie } from "../../interfaces/firebase";
import { ReleaseDate, ReleaseDateType } from "../../interfaces/tmdb";
import {
  BackdropSizes,
  PosterSizes,
} from "../../interfaces/tmdb/configuration";

import { AnimatedHeaderImage } from "@/components/AnimatedHeaderImage";
import { BlueBullet } from "@/components/BlueBullet";
import ButtonSingleState from "@/components/ButtonSingleState";
import CategoryControl from "@/components/CategoryControl/CategoryControl";
import { ExpandableText } from "@/components/ExpandableText";
import { IoniconsHeaderButton } from "@/components/IoniconsHeaderButton";
import { ListLabel } from "@/components/ListLabel";
import { LoadingScreen } from "@/components/LoadingScreen";
import { MoviePoster } from "@/components/Posters/MoviePoster";
import { Text as ThemedText } from "@/components/Themed";
import Trailer from "@/components/Trailer";
import { useComposeRecentItems } from "@/hooks/useComposeRecentItems";
import { useUpdateRecentItems } from "@/hooks/useUpdateRecentItems";
import { useStore } from "@/stores/store";
import { BottomTabParams, FindStackParams, Recent } from "@/types";
import { isoToUTC, compareDates, timestamp } from "@/utils/dates";

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
      horizontal
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
              navigation.push("MovieDiscover", {
                screenTitle: item.name,
                [navParamKey]: item,
              })
            }
            buttonStyle={{
              backgroundColor: PlatformColor("systemGray5"),
              borderColor: PlatformColor("systemGray5"),
            }}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </ScrollView>
  );
}

export function getReleaseDate(releaseDates: ReleaseDate[]) {
  const nonPremiereDates = releaseDates.filter(
    (release) => release.type !== ReleaseDateType.Premiere
  );
  const sortedNonPremiereDates = nonPremiereDates.sort(
    ({ release_date: a }, { release_date: b }) =>
      compareDates(isoToUTC(a), isoToUTC(b))
  );
  return isoToUTC(sortedNonPremiereDates[0].release_date).toLocaleString(
    DateTime.DATE_FULL
  );
}

type MovieScreenNavigationProp = CompositeScreenProps<
  NativeStackScreenProps<FindStackParams, "Movie">,
  CompositeScreenProps<
    BottomTabScreenProps<BottomTabParams, "FindTabStack">,
    BottomTabScreenProps<BottomTabParams, "CountdownTabStack">
  >
>;

function MovieScreen({ navigation, route }: MovieScreenNavigationProp) {
  const { movieId, movieTitle, poster_path } = route.params;
  const { user, movieSubs, isPro } = useStore();
  const isSubbed = movieSubs.find(
    (sub) => sub.documentID === movieId.toString()
  );
  const { data: movieDetails, isLoading } = useMovie(movieId);
  const { data: ratings, isLoading: isLoadingRatings } = useMovieRatings(
    movieDetails?.imdb_id
  );
  // const { data: traktDetails, isLoading: isLoadingTrakt } = useTraktMovie(
  //   movieDetails?.imdb_id
  // );
  const [detailIndex, setDetailIndex] = useState(0);
  const tabBarheight = useBottomTabBarHeight();
  const headerHeight = useHeaderHeight();
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
  const [showImageViewer, setShowImageViewer] = useState({
    isVisible: false,
    index: 0,
  });

  const [creditsSelection, setCreditsSelection] = useState("Cast");

  const modalRef = useRef<BottomSheetModal>();

  const [storedMovies, setStoredMovies] = useMMKVString("recent.movies");
  const composeRecentMovies = useComposeRecentItems(storedMovies);

  const usReleaseDates = movieDetails?.release_dates.results.find(
    (result) => result.iso_3166_1 === "US"
  )?.release_dates;

  // Get cert of first release date where cert is defined
  // Does not consider multiple ratings such as Battle of the Five Armies where Extended Edition is R
  const certification = usReleaseDates?.find(
    (releaseDate) => releaseDate.certification
  )?.certification;

  const runtime = composeRuntime(movieDetails?.runtime);

  const recentMovie: Recent = {
    id: movieId,
    name: movieTitle,
    img_path: poster_path,
    last_viewed: timestamp,
    media_type: "movie",
  };

  useUpdateRecentItems(composeRecentMovies, recentMovie, setStoredMovies, [
    movieId,
    movieTitle,
    poster_path,
  ]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
          <Item
            title="search"
            iconName={isSubbed ? "checkmark-outline" : "add-outline"}
            onPress={() =>
              !isSubbed
                ? subToMovie(movieId.toString(), user!.uid)
                : removeSub("movies", movieId.toString(), user!.uid)
            }
          />
        </HeaderButtons>
      ),
    });
  }, [isSubbed, movieId, navigation, user]);

  useEffect(() => {
    if (movieDetails) {
      const videos = movieDetails.videos.results.some(
        (result) => result.type === "Trailer"
      )
        ? "Trailer"
        : "Teaser";

      const images =
        movieDetails.images.posters.length > 0 ? "posters" : "backdrops";

      setMediaSelections({ videos, images });
    }
  }, [movieDetails]);

  if (isLoading || isLoadingRatings) return <LoadingScreen />;

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
                bottom: tabBarheight - 32,
              }
            : undefined
        }
        showsVerticalScrollIndicator={detailIndex === 0}
      >
        {movieDetails!.backdrop_path && (
          <AnimatedHeaderImage
            scrollOffset={scrollOffset}
            path={movieDetails!.backdrop_path}
          />
        )}
        <View style={{ margin: 16 }}>
          <ThemedText style={iOSUIKit.largeTitleEmphasized}>
            {movieDetails!.title}
          </ThemedText>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.secondarySubhedEmphasized}>
              {usReleaseDates
                ? getReleaseDate(usReleaseDates)
                : "No release date yet"}
            </Text>
            <BlueBullet />
            <Text style={styles.secondarySubhedEmphasized}>
              {movieDetails!.status}
            </Text>
          </View>

          {(runtime || certification) && (
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.secondarySubhedEmphasized}>{runtime}</Text>
              {runtime && certification && <BlueBullet />}
              <Text style={styles.secondarySubhedEmphasized}>
                {certification}
              </Text>
              {isPro && (
                <>
                  <BlueBullet />
                  <Text style={styles.secondarySubhedEmphasized}>
                    ${movieDetails!.revenue.toLocaleString()}
                  </Text>
                </>
              )}
            </View>
          )}

          {isPro && ratings!.length > 0 && (
            <View style={{ marginTop: 16, flexDirection: "row" }}>
              {ratings?.map((rating) => (
                <Rating
                  key={rating.Source}
                  source={rating.Source}
                  rating={rating.Value}
                />
              ))}
            </View>
          )}

          {movieDetails!.tagline && (
            <Text
              style={[
                iOSUIKit.body,
                {
                  paddingTop: 16,
                  fontStyle: "italic",
                  color: PlatformColor("systemGray"),
                },
              ]}
            >
              {movieDetails!.tagline}
            </Text>
          )}

          <ExpandableText text={movieDetails!.overview} />

          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {movieDetails!.genres.map((genre, index) => (
              <ButtonSingleState
                key={index}
                text={genre.name}
                onPress={() =>
                  navigation.push("MovieDiscover", {
                    screenTitle: genre.name,
                    genre,
                  })
                }
                buttonStyle={{
                  paddingHorizontal: 16,
                  flexDirection: "row",
                  backgroundColor: PlatformColor("systemGray5"),
                  borderColor: PlatformColor("systemGray5"),
                }}
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
                  justifyContent: "space-between",
                }}
              >
                <ListLabel text="Watch on" style={{ marginBottom: 0 }} />
                <Pressable onPress={() => modalRef.current?.present()}>
                  <Text
                    style={[
                      iOSUIKit.body,
                      { color: PlatformColor("systemBlue") },
                    ]}
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
                      uri: `https://image.tmdb.org/t/p/${PosterSizes.W154}${item.logo_path}`,
                    }}
                    style={{
                      height: calculateWidth(16, 8, 6),
                      aspectRatio: 1 / 1,
                      borderWidth: 1,
                      borderColor: PlatformColor("separator"),
                      borderRadius: 12,
                    }}
                  />
                )}
                {...horizontalListProps}
                scrollEnabled={false}
              />
            </>
          )}
        </View>
        <CategoryControl
          buttons={["Cast & Crew", "Media", "Discover"]}
          categoryIndex={detailIndex}
          handleCategoryChange={(index: number) => setDetailIndex(index)}
        />
        <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
          {detailIndex === 0 && (
            <>
              <View style={{ flexDirection: "row" }}>
                {["Cast", "Crew"].map((element, i) => (
                  <MediaSelection
                    key={i}
                    option={element}
                    action={() => setCreditsSelection(element)}
                    creditsSelection={creditsSelection}
                  />
                ))}
              </View>

              {(creditsSelection === "Cast"
                ? movieDetails!.credits.cast
                : movieDetails!.credits.crew.sort(
                    ({ popularity: a }, { popularity: b }) => b - a
                  )
              ).map((person) => (
                <Person
                  key={person.credit_id}
                  navigation={navigation}
                  person={person}
                />
              ))}
            </>
          )}

          {detailIndex === 1 && (
            <View>
              {movieDetails!.videos.results.some(
                (result) =>
                  result.type === "Trailer" || result.type === "Teaser"
              ) ? (
                <>
                  <View style={{ flexDirection: "row" }}>
                    {movieDetails!.videos.results.some(
                      (result) => result.type === "Trailer"
                    ) && (
                      <MediaSelection
                        option="Trailers"
                        action={() =>
                          setMediaSelections({
                            ...mediaSelections,
                            videos: "Trailer",
                          })
                        }
                        mediaSelections={mediaSelections}
                      />
                    )}
                    {movieDetails!.videos.results.some(
                      (result) => result.type === "Teaser"
                    ) && (
                      <MediaSelection
                        option="Teasers"
                        action={() =>
                          setMediaSelections({
                            ...mediaSelections,
                            videos: "Teaser",
                          })
                        }
                        mediaSelections={mediaSelections}
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
                    option="Posters"
                    action={() =>
                      setMediaSelections({
                        ...mediaSelections,
                        images: "posters",
                      })
                    }
                    mediaSelections={mediaSelections}
                  />
                )}
                {movieDetails!.images.backdrops.length > 0 && (
                  <MediaSelection
                    option="Backdrops"
                    action={() =>
                      setMediaSelections({
                        ...mediaSelections,
                        images: "backdrops",
                      })
                    }
                    mediaSelections={mediaSelections}
                  />
                )}
              </View>
              <FlatList
                keyExtractor={(item) => item.file_path}
                data={movieDetails!.images[mediaSelections.images]}
                renderItem={({ item, index }) => (
                  <MoviePoster
                    pressHandler={() =>
                      setShowImageViewer({ isVisible: true, index })
                    }
                    posterPath={
                      mediaSelections.images === "posters"
                        ? item.file_path
                        : `https://image.tmdb.org/t/p/${PosterSizes.W780}${item.file_path}`
                    }
                    style={{
                      width:
                        mediaSelections.images === "posters"
                          ? calculateWidth(16, 8, 2.5)
                          : calculateWidth(16, 8, 1.5),
                      aspectRatio:
                        mediaSelections.images === "posters" ? 2 / 3 : 16 / 9,
                    }}
                  />
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
                    navParamKey="company"
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
                    navParamKey="keyword"
                  />
                </>
              )}

              {movieDetails!.belongs_to_collection && (
                <>
                  <DiscoverListLabel text="Collection" />
                  <Pressable
                    onPress={() =>
                      navigation.push("Collection", {
                        name: movieDetails!.belongs_to_collection.name,
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
                    <Image
                      style={{
                        width: Dimensions.get("screen").width - 32,
                        aspectRatio: 16 / 9,
                        borderWidth: 1,
                        borderColor: PlatformColor("separator"),
                        borderRadius: 12,
                      }}
                      source={{
                        uri: `https://image.tmdb.org/t/p/${BackdropSizes.W780}${
                          movieDetails!.belongs_to_collection.backdrop_path
                        }`,
                      }}
                    />
                    <BlurView
                      style={[
                        StyleSheet.absoluteFill,
                        {
                          bottom:
                            // use lineHeight to account for font size + space above/below
                            (Dimensions.get("screen").width - 32) / 1.78 -
                            iOSUIKit.bodyObject.lineHeight -
                            16,
                        },
                      ]}
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
                </>
              )}

              {movieDetails!.recommendations.results.length > 0 && (
                <>
                  <DiscoverListLabel text="Recommended" />
                  <FlatList
                    keyExtractor={(item) => item.id.toString()}
                    data={movieDetails!.recommendations.results}
                    renderItem={({ item }) => (
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
                          width: calculateWidth(16, 8, 2.5),
                          aspectRatio: 2 / 3,
                        }}
                      />
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
          uri: `https://image.tmdb.org/t/p/${BackdropSizes.W780}${image.file_path}`,
        }))}
        imageIndex={showImageViewer.index}
        visible={showImageViewer.isVisible}
        onRequestClose={() =>
          setShowImageViewer({ isVisible: false, index: 0 })
        }
      />
      <WatchProvidersModal
        modalRef={modalRef}
        providers={movieDetails!["watch/providers"].results.US}
      />
    </>
  );
}

const styles = StyleSheet.create({
  secondarySubhedEmphasized: {
    ...iOSUIKit.subheadEmphasizedObject,
    color: PlatformColor("secondaryLabel"),
  },
});

export default MovieScreen;
