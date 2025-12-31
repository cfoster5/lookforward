import { useRouter } from "expo-router";
import { useRef } from "react";
import { FlatList, Pressable, StyleSheet } from "react-native";

import { GamePlatformPicker } from "@/components/GamePlatformPicker";
import { LoadingScreen } from "@/components/LoadingScreen";
import { GamePoster } from "@/components/Posters/GamePoster";
import { Games, ReleaseDate } from "@/types/igdb";

import { useGames } from "./api/getGames";

export function GameLayout() {
  const router = useRouter();
  const scrollRef = useRef<FlatList>(null);
  const { data, isPending } = useGames();

  if (isPending) return <LoadingScreen />;

  return (
    <>
      <FlatList
        data={data}
        renderItem={({
          item: game,
        }: {
          item: Games & { release_dates: ReleaseDate[] };
        }) => (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/(tabs)/(find)/game/[id]",
                params: {
                  id: game.id,
                  game: JSON.stringify(game),
                },
              })
            }
          >
            <GamePoster game={game} />
          </Pressable>
        )}
        numColumns={2}
        contentContainerStyle={[styles.flatlistContentContainer]}
        columnWrapperStyle={styles.flatlistColumnWrapper}
        ref={scrollRef}
        keyExtractor={(item) => item.id.toString()}
        initialNumToRender={6}
        // scrollIndicatorInsets={scrollIndicatorInsets}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      />
      <GamePlatformPicker />
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
