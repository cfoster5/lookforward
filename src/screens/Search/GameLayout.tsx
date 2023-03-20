import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { GamePlatformPicker } from "components/GamePlatformPicker";
import { LoadingScreen } from "components/LoadingScreen";
import { GamePoster } from "components/Posters/GamePoster";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import { Modalize } from "react-native-modalize";

import { ListLabel } from "./Search";
import { useGames } from "./api/getGames";
import Searchbar from "./components/Searchbar/Searchbar";
import useDebounce from "./hooks/useDebounce";

import { useStore } from "@/stores/store";
import { Game, ReleaseDate } from "@/types";

export function GameLayout({ navigation }) {
  const tabBarheight = useBottomTabBarHeight();
  const scrollRef = useRef<FlatList>(null);
  const modalizeRef = useRef<Modalize>(null);
  const { game } = useStore();
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 400);
  const { data, isPreviousData } = useGames(debouncedSearch);

  useEffect(() => {
    // Open GamePlatformPicker if game is changed
    if (game) modalizeRef.current?.open();
  }, [game]);

  return (
    <>
      <Searchbar
        categoryIndex={1}
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
          <ListLabel text="Coming Soon" style={{ marginBottom: 0 }} />
        </View>
      )}
      {!isPreviousData ? (
        <>
          <KeyboardAwareFlatList
            extraScrollHeight={tabBarheight}
            viewIsInsideTabBar
            enableResetScrollToCoords={false}
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
          <GamePlatformPicker modalizeRef={modalizeRef} game={game} />
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
