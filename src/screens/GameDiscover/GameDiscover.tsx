import {
  BottomTabScreenProps,
  useBottomTabBarHeight,
} from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import GameReleaseModal from "components/GamePlatformPicker";
import { LoadingScreen } from "components/LoadingScreen";
import { GamePoster } from "components/Posters/GamePoster";
import { convertReleasesToGames } from "helpers/helpers";
import { IGDB } from "interfaces/igdb";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FlatList, Platform, Pressable } from "react-native";
import { Modalize } from "react-native-modalize";

import { useDiscoverGames } from "./api/getDiscoverGames";

import { useStore } from "@/stores/store";
import { FindStackParams, BottomTabParams } from "@/types";

type GameDiscoverScreenNavigationProp = CompositeScreenProps<
  NativeStackScreenProps<FindStackParams, "GameDiscover">,
  BottomTabScreenProps<BottomTabParams, "FindTabStack">
>;

function GameDiscover({ route, navigation }: GameDiscoverScreenNavigationProp) {
  const { genre, company, keyword } = route.params;
  const [games, setGames] = useState<IGDB.Game.Game[]>([]);
  const scrollRef = useRef<FlatList>(null);
  const tabBarheight = useBottomTabBarHeight();
  const headerHeight = useHeaderHeight();
  const modalizeRef = useRef<Modalize>(null);
  const { data: releaseDates } = useDiscoverGames({ genreId: genre.id });
  const { game } = useStore();

  useLayoutEffect(() => {
    let title = "";
    if (genre) {
      title = genre.name;
    } else if (company) {
      title = company.name;
    } else if (keyword) {
      title = keyword.name;
    }
    navigation.setOptions({ title });
  }, [route.params]);

  useEffect(() => {
    const games = releaseDates ? convertReleasesToGames(releaseDates) : [];
    setGames(games);
  }, [releaseDates]);

  useEffect(() => {
    // Open GamePlatformPicker if game is changed
    modalizeRef.current?.open();
  }, [game]);

  return games?.length > 0 ? (
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
        indicatorStyle="white"
        data={games}
        renderItem={({ item }: { item: IGDB.Game.Game }) => (
          <Pressable onPress={() => navigation.push("Game", { game: item })}>
            <GamePoster item={item} />
          </Pressable>
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
    </>
  ) : (
    <LoadingScreen />
  );
}

export default GameDiscover;
