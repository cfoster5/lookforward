import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useScrollToTop } from "@react-navigation/native";
import { useRef, useState } from "react";
import {
  FlatList,
  PlatformColor,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { iOSUIKit } from "react-native-typography";

import { LoadingScreen } from "@/components/LoadingScreen";
import { MoviePoster } from "@/components/Posters/MoviePoster";
import { calculateWidth } from "@/helpers/helpers";
import { useRecentItemsStore } from "@/stores/recents";
import { useStore } from "@/stores/store";
import { timestamp } from "@/utils/dates";
import { useBottomTabOverflow } from "@/utils/useBottomTabOverflow";

import { useMovieData } from "./api/getMovies";
import { MovieSearchModal } from "./components/MovieSearchModal";
import { MovieOption } from "./types";

export function MovieLayout({ navigation }) {
  const modalRef = useRef<BottomSheetModal>();
  const scrollRef = useRef<FlatList>(null);
  useScrollToTop(scrollRef);
  const [option, setOption] = useState<MovieOption>(MovieOption.ComingSoon);
  const { data, fetchNextPage, hasNextPage, isLoading } = useMovieData(option);
  const { top } = useSafeAreaInsets();
  const { initialSnapPoint } = useStore();
  const { addRecent } = useRecentItemsStore();
  const bottomTabOverflow = useBottomTabOverflow();

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
            minWidth: 60,
            minHeight: 44,
            alignItems: "flex-end",
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
          data={data}
          renderItem={({ item }) => (
            <MoviePoster
              pressHandler={() => {
                navigation.push("Movie", {
                  movieId: item.id,
                  name: item.title,
                });
                addRecent("recentMovies", {
                  id: item.id,
                  name: item.title,
                  img_path: item.poster_path,
                  last_viewed: timestamp,
                  media_type: "movie",
                });
              }}
              movie={item}
              posterPath={item.poster_path}
              style={{
                width: calculateWidth(16, 16, 2),
                aspectRatio: 2 / 3,
              }}
            />
          )}
          numColumns={2}
          contentContainerStyle={[
            styles.flatlistContentContainer,
            { paddingBottom: bottomTabOverflow + initialSnapPoint },
          ]}
          columnWrapperStyle={styles.flatlistColumnWrapper}
          ref={scrollRef}
          keyExtractor={(item, index) => item.id.toString() + index.toString()}
          initialNumToRender={6}
          showsVerticalScrollIndicator={false}
          onEndReached={() => (hasNextPage ? fetchNextPage() : null)}
          onEndReachedThreshold={1.5}
          contentInsetAdjustmentBehavior="automatic"
        />
      ) : (
        <LoadingScreen />
      )}
      <MovieSearchModal
        navigation={navigation}
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
