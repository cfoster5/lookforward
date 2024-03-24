import { BottomSheetModal } from "@gorhom/bottom-sheet";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { iOSUIKit } from "react-native-typography";

import { useMovieData } from "./api/getMovies";
import { MovieSearchModal } from "./components/MovieSearchModal";
import { MovieOption } from "./types";

import { LoadingScreen } from "@/components/LoadingScreen";
import { MoviePoster } from "@/components/Posters/MoviePoster";
import { now } from "@/utils/dates";

export function MovieLayout({ navigation }) {
  const { width: windowWidth } = useWindowDimensions();
  const modalRef = useRef<BottomSheetModal>();
  const scrollRef = useRef<FlatList>(null);
  useScrollToTop(scrollRef);
  const [option, setOption] = useState<MovieOption>(MovieOption.ComingSoon);
  const { data, fetchNextPage, hasNextPage, isLoading } = useMovieData(option);
  const { top } = useSafeAreaInsets();

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
  }, [option]);

  function filteredMovies() {
    if (option === "Coming Soon") {
      return movies?.filter((movie) =>
        movie.release_date
          ? DateTime.fromFormat(movie?.release_date, "yyyy-MM-dd") >= now
          : null
      );
      // return movies;
    } else {
      return movies;
    }
  }

  return (
    <>
      <View
        style={{
          margin: 16,
          marginTop: top,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={[iOSUIKit.title3Emphasized, { color: PlatformColor("label") }]}
        >
          {option}
        </Text>
        {/* <ListLabel text={option} style={{ marginBottom: 0 }} /> */}
        <Pressable
          onPress={() => modalRef.current?.present()}
          style={{
            minWidth: 44,
            minHeight: 44,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={[iOSUIKit.body, { color: PlatformColor("systemBlue") }]}>
            More
          </Text>
        </Pressable>
      </View>

      {!isLoading ? (
        <FlatList
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
                aspectRatio: 2 / 3,
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
