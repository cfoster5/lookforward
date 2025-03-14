import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useRef } from "react";
import { FlatList, Platform, Pressable } from "react-native";

import { useDiscoverGames } from "./api/getDiscoverGames";

import { LoadingScreen } from "@/components/LoadingScreen";
import { GamePoster } from "@/components/Posters/GamePoster";
import {
  FindStackParamList,
  Game,
  ReleaseDate,
  TabNavigationParamList,
} from "@/types";
import { useBottomTabOverflow } from "@/utils/useBottomTabOverflow";

type GameDiscoverScreenNavigationProp = CompositeScreenProps<
  NativeStackScreenProps<FindStackParamList, "GameDiscover">,
  BottomTabScreenProps<TabNavigationParamList, "FindTab">
>;

function GameDiscover({ route, navigation }: GameDiscoverScreenNavigationProp) {
  const { genre } = route.params;
  const scrollRef = useRef<FlatList>(null);
  const paddingBottom = useBottomTabOverflow();
  const { data: games, isLoading } = useDiscoverGames({ genreId: genre.id });

  return !isLoading ? (
    <FlatList
      contentContainerStyle={{
        marginHorizontal: 16,
        ...Platform.select({ ios: { paddingTop: 16 } }),
      }}
      automaticallyAdjustsScrollIndicatorInsets
      contentInsetAdjustmentBehavior="automatic"
      contentInset={{ bottom: paddingBottom }}
      scrollIndicatorInsets={{ bottom: paddingBottom }}
      data={games}
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
      columnWrapperStyle={{
        justifyContent: "space-between",
        marginBottom: 16,
      }}
      ref={scrollRef}
      keyExtractor={(item) => item.id.toString()}
      initialNumToRender={6}
    />
  ) : (
    <LoadingScreen />
  );
}

export default GameDiscover;
