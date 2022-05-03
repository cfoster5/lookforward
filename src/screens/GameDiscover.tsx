import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Platform, View } from "react-native";
import { Modalize } from "react-native-modalize";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";

import GameReleaseModal from "../components/GamePlatformPicker";
import Poster from "../components/Poster";
import GameContext from "../contexts/GamePlatformPickerContexts";
import { convertReleasesToGames } from "../helpers/helpers";
import { discoverGames } from "../helpers/igdbRequests";
import { IGDB } from "../interfaces/igdb";

function GameDiscover({ route, navigation }: any) {
  const [games, setGames] = useState<IGDB.Game.Game[]>([]);
  const scrollRef = useRef<FlatList>(null);
  const tabBarheight = useBottomTabBarHeight();
  const headerHeight = useHeaderHeight();
  const modalizeRef = useRef<Modalize>(null);
  const [game, setGame] = useState();

  useEffect(() => {
    const { genre, company, keyword } = route.params;
    console.log(`genre`, genre);
    // console.log(`company`, company)
    // console.log(`keyword`, keyword)
    setGames([]);
    let title = "";
    let discoverBy = {};
    if (genre) {
      title = genre.name;
      discoverBy = { genreId: genre.id };
    } else if (company) {
      title = company.name;
      discoverBy = { companyId: company.id };
    } else if (keyword) {
      title = keyword.name;
      discoverBy = { keywordId: keyword.id };
    }
    navigation.setOptions({ title: title });

    async function getGames() {
      const releaseDates = await discoverGames({ genreId: genre.id });
      const games = await convertReleasesToGames(releaseDates);
      setGames(games);
    }
    getGames();
  }, [route.params]);

  useEffect(() => {
    // Open GamePlatformPicker if game is changed
    modalizeRef.current?.open();
  }, [game]);

  return games?.length > 0 ? (
    <GameContext.Provider value={{ game, setGame }}>
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
        indicatorStyle="white"
        data={games}
        renderItem={({ item }: { item: IGDB.Game.Game }) => (
          <Poster navigation={navigation} game={item} />
        )}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 16,
        }}
        ref={scrollRef}
        keyExtractor={(item, index) => item.id.toString()}
        initialNumToRender={6}
      />
      <GameReleaseModal modalizeRef={modalizeRef} game={game} />
    </GameContext.Provider>
  ) : (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}

export default GameDiscover;
