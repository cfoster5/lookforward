import { useLocalSearchParams, useRouter, useSegments } from "expo-router";
import { useRef } from "react";
import { FlatList, Platform, Pressable } from "react-native";

import { LoadingScreen } from "@/components/LoadingScreen";
import { GamePoster } from "@/components/Posters/GamePoster";
import { useDiscoverGames } from "@/screens/GameDiscover/api/getDiscoverGames";
import { Games, ReleaseDate } from "@/types/igdb";
import { useBottomTabOverflow } from "@/utils/useBottomTabOverflow";

export default function GameDiscover() {
  const segments = useSegments();
  const stack = segments[1] as "(find)" | "(countdown)";
  const router = useRouter();
  const { genre: genreString } = useLocalSearchParams();
  const genre = genreString ? JSON.parse(genreString) : undefined;
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
        item: Games & { release_dates: ReleaseDate[] };
      }) => (
        <Pressable
          onPress={() =>
            router.navigate({
              pathname: `(tabs)/${stack}/game/[id]`,
              params: { game: JSON.stringify(game) },
            })
          }
        >
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
