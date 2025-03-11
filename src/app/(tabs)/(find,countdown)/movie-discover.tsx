import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useLayoutEffect, useRef, useState } from "react";
import { FlatList, Platform, useWindowDimensions } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { Movie, SortOption } from "tmdb-ts";

import { useMovieWatchProviders } from "@/api/getMovieWatchProviders";
import { useDiscoverMovies } from "@/app/(tabs)/(find,countdown)/api/getDiscoverMovies";
import { NativeIconsHeaderButton } from "@/components/IoniconsHeaderButton";
import { LoadingScreen } from "@/components/LoadingScreen";
import { MoviePoster } from "@/components/Posters/MoviePoster";

import { DiscoveryFilterModal } from "./components/DiscoverFilterModal";

function MovieDiscover() {
  const navigation = useNavigation();
  const { width: windowWidth } = useWindowDimensions();
  const { with_genres, with_companies, with_keywords, with_watch_providers } =
    useLocalSearchParams();
  const scrollRef = useRef<FlatList>(null);
  const tabBarheight = useBottomTabBarHeight();
  const headerHeight = useHeaderHeight();
  const [sortMethod, setSortMethod] = useState<SortOption>("popularity.desc");
  const [selectedMovieWatchProvider, setSelectedMovieWatchProvider] =
    useState<number>(with_watch_providers ?? 0);

  const {
    data: movies,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useDiscoverMovies({
    with_genres,
    with_companies,
    with_keywords,
    with_watch_providers: selectedMovieWatchProvider,
    sort_by: sortMethod,
  });
  const { data: movieWatchProviders } = useMovieWatchProviders();
  const modalRef = useRef<BottomSheetModal>();

  useLayoutEffect(() => {
    navigation.setOptions({
      // Relies on dynamic data that is only available within the component's scope
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <HeaderButtons
          HeaderButtonComponent={
            (props) => NativeIconsHeaderButton({ ...props })
            // IoniconsHeaderButton({ ...props, iconSize: 23 })
          }
        >
          <Item
            title="filter"
            iconName="line.3.horizontal.decrease"
            onPress={() => modalRef.current?.present()}
          />
        </HeaderButtons>
      ),
    });
  }, [navigation]);

  if (isLoading) return <LoadingScreen />;

  return (
    <>
      <FlatList
        contentContainerStyle={{
          paddingTop: Platform.OS === "ios" ? headerHeight + 16 : 16,
          paddingBottom: Platform.OS === "ios" ? tabBarheight : undefined,
          marginHorizontal: 16,
        }}
        scrollIndicatorInsets={
          Platform.OS === "ios"
            ? {
                top: 16,
                bottom: tabBarheight - 16,
              }
            : undefined
        }
        data={movies}
        renderItem={({ item }: { item: Movie }) => (
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
              width: windowWidth / 2 - 24,
              aspectRatio: 2 / 3,
            }}
          />
        )}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 16,
        }}
        ref={scrollRef}
        keyExtractor={(item) => item.id.toString()}
        initialNumToRender={6}
        onEndReached={() => (hasNextPage ? fetchNextPage() : null)}
        onEndReachedThreshold={1.5}
      />
      <DiscoveryFilterModal
        modalRef={modalRef}
        sortMethod={sortMethod}
        setSortMethod={setSortMethod}
        selectedMovieWatchProvider={selectedMovieWatchProvider}
        setSelectedMovieWatchProvider={setSelectedMovieWatchProvider}
        movieWatchProviders={movieWatchProviders}
      />
    </>
  );
}

export default MovieDiscover;
