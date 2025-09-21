import * as Colors from "@bacons/apple-colors";
import { useRouter } from "expo-router";
import { useRef } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { iOSUIKit } from "react-native-typography";

import { GamePlatformPicker } from "@/components/GamePlatformPicker";
import { LoadingScreen } from "@/components/LoadingScreen";
import { GamePoster } from "@/components/Posters/GamePoster";
import { useStore } from "@/stores/store";
import { Games, ReleaseDate } from "@/types/igdb";
import { useBottomTabOverflow } from "@/utils/useBottomTabOverflow";

import { useGames } from "./api/getGames";

export function GameLayout() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const scrollRef = useRef<FlatList>(null);
  const { data, isLoading } = useGames();
  const { initialSnapPoint } = useStore();
  const bottomTabOverflow = useBottomTabOverflow();

  return (
    <>
      <View
        style={{
          margin: 16,
          // marginTop: top,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={[iOSUIKit.title3Emphasized, { color: Colors.label }]}>
          Coming Soon
        </Text>
        <Pressable
          style={{
            minWidth: 44,
            minHeight: 44,
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      </View>

      {!isLoading ? (
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
            contentContainerStyle={[
              styles.flatlistContentContainer,
              { paddingBottom: bottomTabOverflow + initialSnapPoint },
            ]}
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
      ) : (
        <LoadingScreen />
      )}
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
