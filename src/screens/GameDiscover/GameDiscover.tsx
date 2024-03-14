import {
  BottomTabScreenProps,
  useBottomTabBarHeight,
} from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";
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

type GameDiscoverScreenNavigationProp = CompositeScreenProps<
  NativeStackScreenProps<FindStackParamList, "GameDiscover">,
  BottomTabScreenProps<TabNavigationParamList, "FindTab">
>;

function GameDiscover({ route, navigation }: GameDiscoverScreenNavigationProp) {
  const { genre, company, keyword } = route.params;
  const scrollRef = useRef<FlatList>(null);
  const tabBarheight = useBottomTabBarHeight();
  const headerHeight = useHeaderHeight();
  const { data: games, isLoading } = useDiscoverGames({ genreId: genre.id });

  return !isLoading ? (
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
      keyExtractor={(item, index) => item.id.toString()}
      initialNumToRender={6}
    />
  ) : (
    <LoadingScreen />
  );
}

export default GameDiscover;
