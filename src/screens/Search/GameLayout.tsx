import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useRef, useState } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";

import { useGames } from "./api/getGames";

import { GamePlatformPicker } from "@/components/GamePlatformPicker";
import { ListLabel } from "@/components/ListLabel";
import { LoadingScreen } from "@/components/LoadingScreen";
import { GamePoster } from "@/components/Posters/GamePoster";
import { Game, ReleaseDate } from "@/types";

export function GameLayout({ navigation }) {
  const tabBarheight = useBottomTabBarHeight();
  const scrollRef = useRef<FlatList>(null);
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 400);
  const { data, isLoading } = useGames(debouncedSearch);

  return (
    <>
      {/* <Searchbar
        categoryIndex={1}
        handleChange={(text) => setSearchValue(text)}
        value={searchValue}
      /> */}
      {!debouncedSearch && (
        <View
          style={{
            margin: 16,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <ListLabel text="Coming Soon" style={{ marginBottom: 0 }} />
        </View>
      )}
      {!isLoading ? (
        <>
          <FlatList
            data={data}
            renderItem={({
              item: game,
            }: {
              item: Game & { release_dates: ReleaseDate[] };
            }) => (
              <Pressable onPress={() => navigation.push("Game", { game })}>
                <GamePoster game={game} />
              </Pressable>
            )}
            numColumns={2}
            contentContainerStyle={styles.flatlistContentContainer}
            columnWrapperStyle={styles.flatlistColumnWrapper}
            ref={scrollRef}
            keyExtractor={(item) => item.id.toString()}
            initialNumToRender={6}
            // scrollIndicatorInsets={scrollIndicatorInsets}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              debouncedSearch ? (
                <ListLabel text="Games" style={{ marginBottom: 16 }} />
              ) : null
            }
          />
          <GamePlatformPicker />
        </>
      ) : (
        <LoadingScreen />
      )}
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
