import { useScrollToTop } from "@react-navigation/native";
import { useRef } from "react";
import { FlatList, StyleSheet } from "react-native";

import { LoadingScreen } from "@/components/LoadingScreen";
import { MoviePoster } from "@/components/Posters/MoviePoster";
import { calculateWidth } from "@/helpers/helpers";
import { useInterfaceStore } from "@/stores/interface";

import { useMovieData } from "./api/getMovies";
import { MovieSearchModal } from "./components/MovieSearchModal";

const spacing = 16;

const posterStyle = {
  width: calculateWidth(spacing, spacing, 2),
  aspectRatio: 2 / 3,
};

const leftColumnStyle = { marginRight: spacing / 2 };
const rightColumnStyle = { marginLeft: spacing / 2 };

export function MovieLayout() {
  const scrollRef = useRef<FlatList>(null);
  useScrollToTop(scrollRef);
  const { movieSearchModalRef, movieSearchOption, setMovieSearchOption } =
    useInterfaceStore();
  const { data, fetchNextPage, hasNextPage, isLoading } =
    useMovieData(movieSearchOption);

  return (
    <>
      {!isLoading ? (
        <FlatList
          data={data}
          renderItem={({ item, index }) => (
            <MoviePoster
              movie={item}
              posterPath={item.poster_path}
              style={posterStyle}
              buttonStyle={index % 2 === 0 ? leftColumnStyle : rightColumnStyle}
            />
          )}
          numColumns={2}
          contentContainerStyle={styles.flatlistContentContainer}
          columnWrapperStyle={styles.flatlistColumnWrapper}
          ref={scrollRef}
          keyExtractor={(item) => item.id.toString()}
          initialNumToRender={6}
          showsVerticalScrollIndicator={false}
          onEndReached={() => (hasNextPage ? fetchNextPage() : null)}
          onEndReachedThreshold={2}
          contentInsetAdjustmentBehavior="automatic"
        />
      ) : (
        <LoadingScreen />
      )}
      <MovieSearchModal
        modalRef={movieSearchModalRef}
        selectedOption={movieSearchOption}
        setSelectedOption={(option) => {
          setMovieSearchOption(option);
          movieSearchModalRef.current?.dismiss();
          scrollRef.current?.scrollToIndex({ index: 0 });
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  flatlistContentContainer: {
    marginHorizontal: spacing,
  },
  flatlistColumnWrapper: {
    justifyContent: "space-between",
    marginBottom: spacing,
  },
});
