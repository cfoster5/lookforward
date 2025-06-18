import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { getAnalytics } from "@react-native-firebase/analytics";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { DateTime } from "luxon";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { iOSUIKit } from "react-native-typography";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import {
  BackdropSizes,
  PosterSizes,
  ReleaseDate,
  ReleaseDateType,
} from "tmdb-ts";

import { AnimatedHeaderImage } from "@/components/AnimatedHeaderImage";
import { ApplePillButton } from "@/components/ApplePillButton";
import { BlueBullet } from "@/components/BlueBullet";
import ButtonSingleState from "@/components/ButtonSingleState";
import { CategoryControl } from "@/components/CategoryControl";
import { DropdownMenu } from "@/components/DropdownMenu";
import { ExpandableText } from "@/components/ExpandableText";
import { IoniconsHeaderButton } from "@/components/IoniconsHeaderButton";
import { LargeBorderlessButton } from "@/components/LargeBorderlessButton";
import { ListLabel } from "@/components/ListLabel";
import { LoadingScreen } from "@/components/LoadingScreen";
import { MoviePoster } from "@/components/Posters/MoviePoster";
import { Text as ThemedText } from "@/components/Themed";
import Trailer from "@/components/Trailer";
import { horizontalListProps } from "@/constants/HorizontalListProps";
import { getReleaseDatesByCountry } from "@/helpers/getReleaseDatesByCountry";
import {
  calculateWidth,
  removeSub,
  subToMovie,
  tmdbMovieGenres,
} from "@/helpers/helpers";
import useAddRecent from "@/hooks/useAddRecent";
import { useCountdownLimit } from "@/hooks/useCountdownLimit";
import { useStore } from "@/stores/store";
import { FindStackParamList, Recent, TabNavigationParamList } from "@/types";
import { isoToUTC, compareDates, timestamp } from "@/utils/dates";
import { onShare } from "@/utils/share";
import { useBottomTabOverflow } from "@/utils/useBottomTabOverflow";

import { useMovie } from "./api/getMovie";
import { useMovieRatings } from "./api/getMovieRatings";
import { DiscoverListLabel } from "./components/DiscoverListLabel";
import { ImageGallery } from "./components/ImageGallery";
import Person from "./components/Person";
import { Rating } from "./components/Rating";
import WatchProvidersModal from "./components/WatchProvidersModal";
import {
  CreditSelectionProps,
  ImageSelectionProps,
  VideoSelectionProps,
} from "./types";
import { composeGroupedJobCredits } from "./utils/composeGroupedJobCredits";
import { composeRuntime } from "./utils/composeRuntime";

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
              backgroundColor: PlatformColor(
                "secondarySystemGroupedBackground",
              ),
              borderColor: PlatformColor("secondarySystemGroupedBackground"),
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
    (release) => release.type !== ReleaseDateType.Premiere,
  );
  const sortedNonPremiereDates = nonPremiereDates.sort(
    ({ release_date: a }, { release_date: b }) =>
      compareDates(isoToUTC(a), isoToUTC(b)),
  );
  return isoToUTC(sortedNonPremiereDates[0].release_date).toLocaleString(
    DateTime.DATE_FULL,
  );
}

type MovieScreenNavigationProp = CompositeScreenProps<
  NativeStackScreenProps<FindStackParamList, "Movie">,
  CompositeScreenProps<
    BottomTabScreenProps<TabNavigationParamList, "FindTab">,
    BottomTabScreenProps<TabNavigationParamList, "CountdownTab">
  >
>;

function MovieScreen({ navigation, route }: MovieScreenNavigationProp) {
  const { movieId, name } = route.params;
  const { user, movieSubs, isPro, proModalRef } = useStore();
  const checkLimit = useCountdownLimit();
  const isSubbed = movieSubs.find(
    (sub) => sub.documentID === movieId.toString(),
  );
  const { data: movieDetails, isLoading } = useMovie(movieId);
  const { data: ratings, isLoading: isLoadingRatings } = useMovieRatings(
    movieDetails?.imdb_id,
  );
  // const { data: traktDetails, isLoading: isLoadingTrakt } = useTraktMovie(
  //   movieDetails?.imdb_id
  // );
  const [detailIndex, setDetailIndex] = useState(0);
  const headerHeight = useHeaderHeight();
  const paddingBottom = useBottomTabOverflow();
  const scrollOffset = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(
    (e) => (scrollOffset.value = e.contentOffset.y),
  );
  const [videoSelection, setVideoSelection] = useState<VideoSelectionProps>({
    value: "Trailer",
    label: "Trailers",
  });
  const [imageSelection, setImageSelection] = useState<ImageSelectionProps>({
    value: "posters",
    label: "Posters",
  });
  const [creditSelection, setCreditSelection] = useState<CreditSelectionProps>({
    value: "Cast",
    label: "Cast",
  });

  const modalRef = useRef<BottomSheetModal>();

  const usReleaseDates = getReleaseDatesByCountry(
    movieDetails?.release_dates,
    "US",
  );

  // Get cert of first release date where cert is defined
  // Does not consider multiple ratings such as Battle of the Five Armies where Extended Edition is R
  const certification = usReleaseDates?.find(
    (releaseDate) => releaseDate.certification,
  )?.certification;

  const runtime = composeRuntime(movieDetails?.runtime);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
          <Item
            title="search"
            iconName={isSubbed ? "checkmark-outline" : "add-outline"}
            onPress={() =>
              !isSubbed
                ? subToMovie(movieId.toString(), user!.uid, () =>
                    checkLimit("movies"),
                  )
                : removeSub("movies", movieId.toString(), user!.uid)
            }
          />
          <Item
            title="share"
            iconName="share-outline"
            onPress={() =>
              onShare(`movie/${movieId}?name=${name}`, "headerButton")
            }
          />
        </HeaderButtons>
      ),
    });
  }, [isSubbed, movieId, name, navigation, user, checkLimit]);

  // Memoize object to avoid unnecessary recalculations and re-renders.
  // Improves performance by ensuring that the object is only recalculated when its dependencies change.
  const recentMovie: Recent = useMemo(
    () => ({
      id: movieId,
      name,
      img_path: movieDetails?.poster_path,
      last_viewed: timestamp,
      media_type: "movie",
    }),
    [movieId, name, movieDetails?.poster_path],
  );

  useAddRecent("recentMovies", recentMovie);

  useEffect(() => {
    if (movieDetails) {
      setVideoSelection(
        movieDetails.videos.results.some((result) => result.type === "Trailer")
          ? { value: "Trailer", label: "Trailers" }
          : { value: "Teaser", label: "Teasers" },
      );

      setImageSelection(
        movieDetails.images.posters.length > 0
          ? { value: "posters", label: "Posters" }
          : { value: "backdrops", label: "Backdrops" },
      );
    }
  }, [movieDetails]);

  if (isLoading || !movieDetails || isLoadingRatings) return <LoadingScreen />;

  return (
    <>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        automaticallyAdjustsScrollIndicatorInsets
        contentInsetAdjustmentBehavior="automatic"
        contentInset={{ bottom: paddingBottom }}
        scrollIndicatorInsets={{ bottom: paddingBottom }}
        contentContainerStyle={Platform.select({
          ios: { paddingTop: headerHeight },
        })}
        showsVerticalScrollIndicator={detailIndex === 0}
      >
        {movieDetails.backdrop_path && (
          <AnimatedHeaderImage
            scrollOffset={scrollOffset}
            path={movieDetails.backdrop_path}
          />
        )}
        <View style={{ margin: 16 }}>
          <ThemedText style={iOSUIKit.largeTitleEmphasized}>
            {movieDetails.title}
          </ThemedText>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.secondarySubhedEmphasized}>
              {usReleaseDates
                ? getReleaseDate(usReleaseDates)
                : "No release date yet"}
            </Text>
            <BlueBullet />
            <Text style={styles.secondarySubhedEmphasized}>
              {movieDetails.status}
            </Text>
          </View>

          {(runtime || certification) && (
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.secondarySubhedEmphasized}>{runtime}</Text>
              {runtime && certification && <BlueBullet />}
              <Text style={styles.secondarySubhedEmphasized}>
                {certification}
              </Text>
              {movieDetails.revenue > 0 && (
                <>
                  <BlueBullet />
                  {!isPro ? (
                    <>
                      <Text style={styles.secondarySubhedEmphasized}>$</Text>
                      <View
                        style={{
                          width: 44 * 2,
                          // backgroundColor: "rgba(120, 120, 120, 0.12)",
                          backgroundColor: PlatformColor("placeholderText"),
                          opacity: 0.5,
                          borderRadius: 4,
                        }}
                      />
                    </>
                  ) : (
                    <Text style={styles.secondarySubhedEmphasized}>
                      ${movieDetails.revenue.toLocaleString()}
                    </Text>
                  )}
                </>
              )}
            </View>
          )}

          {ratings && ratings?.length > 0 && (
            <View style={{ marginTop: 16, flexDirection: "row" }}>
              {ratings.map((rating) => (
                <Rating
                  key={rating.Source}
                  source={rating.Source}
                  rating={rating.Value}
                />
              ))}
            </View>
          )}

          {!isPro && (
            <LargeBorderlessButton
              handlePress={async () => {
                proModalRef.current?.present();
                await getAnalytics().logEvent("select_promotion", {
                  name: "Pro",
                  id: "com.lookforward.pro",
                });
              }}
              text="Explore Pro Features"
              style={{ paddingBottom: 0 }}
            />
          )}

          {movieDetails.tagline && (
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
              {movieDetails.tagline}
            </Text>
          )}

          <ExpandableText text={movieDetails.overview} />

          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {movieDetails.genres.map((genre, index) => (
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
                  backgroundColor: PlatformColor(
                    "secondarySystemGroupedBackground",
                  ),
                  borderColor: PlatformColor(
                    "secondarySystemGroupedBackground",
                  ),
                }}
                icon={tmdbMovieGenres.find((obj) => obj.id === genre.id)?.icon}
                textStyle={{ alignSelf: "center" }}
              />
            ))}
          </View>

          {(movieDetails["watch/providers"].results.US?.flatrate?.length > 0 ||
            movieDetails["watch/providers"].results.US?.rent?.length > 0 ||
            movieDetails["watch/providers"].results.US?.buy?.length > 0) && (
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
                      ...(movieDetails["watch/providers"].results.US
                        ?.flatrate || []),
                      ...(movieDetails["watch/providers"].results.US?.rent ||
                        []),
                      ...(movieDetails["watch/providers"].results.US?.buy ||
                        []),
                    ].map((item) => [item["provider_id"], item]),
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
                {/* Wrap with a View with flexDirection to not take full width of screen*/}
                <DropdownMenu
                  options={[
                    { value: "Cast", label: "Cast" },
                    { value: "Crew", label: "Crew" },
                  ]}
                  handleSelect={(value, label) =>
                    setCreditSelection({ value, label } as CreditSelectionProps)
                  }
                >
                  <ApplePillButton text={creditSelection.label} />
                </DropdownMenu>
              </View>

              {(creditSelection.value === "Cast"
                ? movieDetails.credits.cast
                : composeGroupedJobCredits(movieDetails?.credits.crew)
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
              {movieDetails.videos.results.some(
                (result) =>
                  result.type === "Trailer" || result.type === "Teaser",
              ) ? (
                <>
                  <View style={{ flexDirection: "row" }}>
                    {/* Wrap with a View with flexDirection to not take full width of screen*/}
                    <DropdownMenu
                      options={[
                        ...(movieDetails.videos.results.some(
                          (result) => result.type === "Trailer",
                        )
                          ? [{ value: "Trailer", label: "Trailers" }]
                          : []),
                        ...(movieDetails.videos.results.some(
                          (result) => result.type === "Teaser",
                        )
                          ? [{ value: "Teaser", label: "Teasers" }]
                          : []),
                      ]}
                      handleSelect={(value, label) =>
                        setVideoSelection({
                          value,
                          label,
                        } as VideoSelectionProps)
                      }
                    >
                      <ApplePillButton text={videoSelection.label} />
                    </DropdownMenu>
                  </View>
                  <FlatList
                    keyExtractor={(item) => item.id}
                    data={movieDetails.videos.results.filter(
                      (result) => result.type === videoSelection.value,
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
              {movieDetails.images.posters.length > 0 ||
              movieDetails.images.backdrops.length > 0 ? (
                <>
                  <View style={{ flexDirection: "row" }}>
                    {/* Wrap with a View with flexDirection to not take full width of screen*/}
                    <DropdownMenu
                      options={[
                        ...(movieDetails.images.posters.length > 0
                          ? [{ value: "posters", label: "Posters" }]
                          : []),
                        ...(movieDetails.images.backdrops.length > 0
                          ? [{ value: "backdrops", label: "Backdrops" }]
                          : []),
                      ]}
                      handleSelect={(value, label) =>
                        setImageSelection({
                          value,
                          label,
                        } as ImageSelectionProps)
                      }
                    >
                      <ApplePillButton text={imageSelection.label} />
                    </DropdownMenu>
                  </View>
                  <ImageGallery
                    images={movieDetails.images}
                    selection={imageSelection}
                  />
                </>
              ) : (
                <ThemedText style={[iOSUIKit.body, { paddingTop: 16 }]}>
                  No images yet! Come back later!
                </ThemedText>
              )}
            </View>
          )}
          {detailIndex === 2 && (
            <>
              {movieDetails.production_companies.length > 0 && (
                <>
                  <DiscoverListLabel text="Production" />
                  <ScrollViewWithFlatList
                    data={movieDetails.production_companies}
                    numColumns={
                      movieDetails.production_companies.length > 2
                        ? Math.ceil(
                            movieDetails.production_companies.length / 2,
                          )
                        : 2
                    }
                    navigation={navigation}
                    navParamKey="company"
                  />
                </>
              )}
              {movieDetails.keywords.keywords.length > 0 && (
                <>
                  <DiscoverListLabel text="Keywords" />
                  <ScrollViewWithFlatList
                    data={movieDetails.keywords.keywords}
                    numColumns={Math.ceil(
                      movieDetails.keywords.keywords.length / 2,
                    )}
                    navigation={navigation}
                    navParamKey="keyword"
                  />
                </>
              )}

              {movieDetails.belongs_to_collection && (
                <>
                  <DiscoverListLabel text="Collection" />
                  <Pressable
                    onPress={() =>
                      navigation.push("Collection", {
                        name: movieDetails.belongs_to_collection.name,
                        collectionId: movieDetails.belongs_to_collection?.id,
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
                        uri: `https://image.tmdb.org/t/p/${BackdropSizes.W780}${movieDetails.belongs_to_collection.backdrop_path}`,
                      }}
                    />
                    <BlurView
                      tint="dark"
                      intensity={100}
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
                      {movieDetails.belongs_to_collection.name}
                    </ThemedText>
                  </Pressable>
                </>
              )}

              {movieDetails.recommendations.results.length > 0 && (
                <>
                  <DiscoverListLabel text="Recommended" />
                  <FlatList
                    keyExtractor={(item) => item.id.toString()}
                    data={movieDetails.recommendations.results}
                    renderItem={({ item }) => (
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
      <WatchProvidersModal
        modalRef={modalRef}
        providers={movieDetails["watch/providers"].results.US}
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
