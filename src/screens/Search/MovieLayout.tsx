import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useScrollToTop } from "@react-navigation/native";
import { DateTime } from "luxon";
import { useEffect, useRef, useState } from "react";
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
import { iOSUIKit } from "react-native-typography";

import { useMovieData } from "./api/getMovies";
import { MovieSearchModal } from "./components/MovieSearchModal";
import { MovieOption } from "./types";

import { ListLabel } from "@/components/ListLabel";
import { LoadingScreen } from "@/components/LoadingScreen";
import { MoviePoster } from "@/components/Posters/MoviePoster";

export function MovieLayout({ navigation }) {
  const tabBarheight = useBottomTabBarHeight();
  const { width: windowWidth } = useWindowDimensions();
  const modalRef = useRef<BottomSheetModal>();
  const scrollRef = useRef<FlatList>(null);
  useScrollToTop(scrollRef);
  const [option, setOption] = useState<MovieOption>(MovieOption.ComingSoon);
  const { data, fetchNextPage, hasNextPage, isLoading } = useMovieData(option);

  const movies = data?.pages.flatMap((page) => page.results);

  useEffect(() => {
    // Manually get second page on load to fix cases where empty space is rendered before scrolling
    if (data?.pages.filter((page) => page.page === 2).length === 0) {
      fetchNextPage({ pageParam: 2 });
    }
  }, [data, fetchNextPage]);

  useEffect(() => {
    modalRef.current?.dismiss();
    // https://stackoverflow.com/a/64232399/5648619
    if (scrollRef !== null && scrollRef.current !== null && movies) {
      if (typeof scrollRef.current.scrollToIndex === "function") {
        scrollRef.current?.scrollToIndex({ index: 0 });
      }
    }
  }, [movies, option]);

  function filteredMovies() {
      if (option === "Coming Soon") {
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

  return (
    <>
      {/* <Searchbar
        categoryIndex={0}
        handleChange={(text) => setSearchValue(text)}
        value={searchValue}
      /> */}

        <View
          style={{
          margin: 16,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <ListLabel text={option} style={{ marginBottom: 0 }} />
          <Pressable onPress={() => modalRef.current?.present()}>
          <Text style={[iOSUIKit.body, { color: PlatformColor("systemBlue") }]}>
              More
            </Text>
          </Pressable>
        </View>

      {!isLoading ? (
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
                  poster_path: item.poster_path,
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
        />
      ) : (
        <LoadingScreen />
      )}
      <MovieSearchModal
        navigation={navigation}
        modalRef={modalRef}
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
