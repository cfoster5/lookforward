import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useScrollToTop } from "@react-navigation/native";
import { LoadingScreen } from "components/LoadingScreen";
import { MoviePoster } from "components/Posters/MoviePoster";
import { DateTime } from "luxon";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  PlatformColor,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import { Modalize } from "react-native-modalize";
import { iOSUIKit } from "react-native-typography";

import { ListLabel } from "./Search";
import { useMovieData } from "./api/getMovies";
import MovieSearchModal from "./components/MovieSearchModal";
import SearchPerson from "./components/SearchPerson";
import Searchbar from "./components/Searchbar/Searchbar";
import useDebounce from "./hooks/useDebounce";
import { MovieOption } from "./types";

export function MovieLayout({ navigation }) {
  const tabBarheight = useBottomTabBarHeight();
  const { width: windowWidth } = useWindowDimensions();
  const filterModalRef = useRef<Modalize>(null);
  const scrollRef = useRef<FlatList>(null);
  useScrollToTop(scrollRef);
  const [option, setOption] = useState<MovieOption>("Coming Soon");
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 400);
  const {
    data: movieData,
    fetchNextPage,
    hasNextPage,
    isPreviousData,
  } = useMovieData(option, debouncedSearch);

  const movies = movieData?.pages.flatMap((page) => page.results);

  useEffect(() => {
    // Manually get second page on load to fix cases where empty space is rendered before scrolling
    if (movieData?.pages.filter((page) => page.page === 2).length === 0) {
      fetchNextPage({ pageParam: 2 });
    }
  }, [movieData]);

  useEffect(() => {
    filterModalRef.current?.close();
    // https://stackoverflow.com/a/64232399/5648619
    if (scrollRef !== null && scrollRef.current !== null && movies) {
      if (typeof scrollRef.current.scrollToIndex === "function") {
        scrollRef.current?.scrollToIndex({ index: 0 });
      }
    }
  }, [option]);

  function filteredMovies() {
    if (debouncedSearch) {
      return movies.filter((movie) => movie.media_type === "movie");
    } else {
      if (option == "Coming Soon") {
        return movies?.filter((movie) => {
          return movie.release_date
            ? DateTime.fromFormat(movie?.release_date, "yyyy-MM-dd") >=
                DateTime.now()
            : null;
        });
        // return movies;
      } else {
        return movies;
      }
    }
  }

  return (
    <>
      <Searchbar
        categoryIndex={0}
        handleChange={(text) => setSearchValue(text)}
        value={searchValue}
      />
      {!debouncedSearch && (
        <View
          style={{
            marginHorizontal: 16,
            marginBottom: 16,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <ListLabel text={option} style={{ marginBottom: 0 }} />
          <Pressable onPress={() => filterModalRef.current?.open()}>
            <Text
              style={[iOSUIKit.body, { color: PlatformColor("systemBlue") }]}
            >
              More
            </Text>
          </Pressable>
        </View>
      )}

      {!isPreviousData ? (
        <KeyboardAwareFlatList
          extraScrollHeight={tabBarheight}
          viewIsInsideTabBar
          enableResetScrollToCoords={false}
          data={filteredMovies()}
          renderItem={({ item }) => (
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
                width: windowWidth / 2 - 24,
                height: (windowWidth / 2 - 24) * 1.5,
              }}
            />
          )}
          numColumns={2}
          contentContainerStyle={styles.flatlistContentContainer}
          columnWrapperStyle={styles.flatlistColumnWrapper}
          ref={scrollRef}
          keyExtractor={(item) => item.id.toString()}
          initialNumToRender={6}
          // scrollIndicatorInsets={scrollIndicatorInsets}
          showsVerticalScrollIndicator={false}
          onEndReached={() => (hasNextPage ? fetchNextPage() : null)}
          onEndReachedThreshold={1.5}
          ListHeaderComponent={
            debouncedSearch ? (
              <>
                {(movies as TMDB.Search.MultiSearchResult[]).filter(
                  (movie) => movie.media_type === "person"
                ).length > 0 && (
                  <>
                    <ListLabel text="People" />
                    <FlatList
                      keyExtractor={(item) => item.id.toString()}
                      data={movies.filter(
                        (movie) => movie.media_type === "person"
                      )}
                      renderItem={(person) => (
                        <SearchPerson
                          navigation={navigation}
                          person={person.item}
                        />
                      )}
                      horizontal
                      style={{
                        marginHorizontal: -16,
                        marginBottom: 16,
                      }}
                      showsHorizontalScrollIndicator={false}
                      ListHeaderComponent={<View style={{ width: 16 }} />}
                      ItemSeparatorComponent={() => (
                        <View style={{ width: 16 }} />
                      )}
                      ListFooterComponent={<View style={{ width: 16 }} />}
                    />
                  </>
                )}
                {movies.filter((movie) => movie.media_type === "movie").length >
                  0 && <ListLabel text="Movies" />}
              </>
            ) : null
          }
        />
      ) : (
        <LoadingScreen />
      )}
      <MovieSearchModal
        navigation={navigation}
        filterModalRef={filterModalRef}
        selectedOption={option}
        setSelectedOption={(option) => setOption(option)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  flatlistContentContainer: {
    marginHorizontal: 16,
    // paddingBottom: Platform.OS === "ios" ? tabBarheight : undefined,
  },
  flatlistColumnWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
});
