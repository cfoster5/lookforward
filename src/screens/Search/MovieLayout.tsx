import * as Colors from "@bacons/apple-colors";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useScrollToTop } from "@react-navigation/native";
import { useRef, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { iOSUIKit } from "react-native-typography";

import { LoadingScreen } from "@/components/LoadingScreen";
import { MoviePoster } from "@/components/Posters/MoviePoster";
import { calculateWidth } from "@/helpers/helpers";

import { useMovieData } from "./api/getMovies";
import { MovieSearchModal } from "./components/MovieSearchModal";
import { MovieOption } from "./types";

export function MovieLayout() {
  const modalRef = useRef<BottomSheetModal>();
  const scrollRef = useRef<FlatList>(null);
  useScrollToTop(scrollRef);
  const [option, setOption] = useState<MovieOption>(MovieOption.ComingSoon);
  const { data, fetchNextPage, hasNextPage, isLoading } = useMovieData(option);

  return (
    <>
      <View
        style={{
          margin: 16,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={[iOSUIKit.title3Emphasized, { color: Colors.label }]}>
          {option}
        </Text>
        <Pressable
          onPress={() => modalRef.current?.present()}
          style={{
            minWidth: 60,
            minHeight: 44,
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          <Text style={[iOSUIKit.body, { color: Colors.systemBlue }]}>
            More
          </Text>
        </Pressable>
      </View>

      {!isLoading ? (
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <MoviePoster
              movie={item}
              posterPath={item.poster_path}
              style={{
                width: calculateWidth(16, 16, 2),
                aspectRatio: 2 / 3,
              }}
            />
          )}
          numColumns={2}
          contentContainerStyle={styles.flatlistContentContainer}
          columnWrapperStyle={styles.flatlistColumnWrapper}
          ref={scrollRef}
          keyExtractor={(item, index) => item.id.toString() + index.toString()}
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
        modalRef={modalRef}
        selectedOption={option}
        setSelectedOption={(option) => {
          setOption(option);
          modalRef.current?.dismiss();
          scrollRef.current?.scrollToIndex({ index: 0 });
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  flatlistContentContainer: {
    marginHorizontal: 16,
  },
  flatlistColumnWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
});
