import { useRef } from "react";
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

import { GamePlatformPicker } from "@/components/GamePlatformPicker";
import { LoadingScreen } from "@/components/LoadingScreen";
import { GamePoster } from "@/components/Posters/GamePoster";
import { useRecentItemsStore } from "@/stores/recents";
import { useStore } from "@/stores/store";
import { Game, ReleaseDate } from "@/types";
import { timestamp } from "@/utils/dates";
import { useBottomTabOverflow } from "@/utils/useBottomTabOverflow";

import { useGames } from "./api/getGames";

export function GameLayout({ navigation }) {
  const { top } = useSafeAreaInsets();
  const scrollRef = useRef<FlatList>(null);
  const { data, isLoading } = useGames();
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
              item: Game & { release_dates: ReleaseDate[] };
            }) => (
              <Pressable
                onPress={() => {
                  navigation.push("Game", { game });
                  addRecent("recentGames", {
                    id: game.id,
                    name: game.name,
                    img_path: game.cover?.url ?? "",
                    last_viewed: timestamp,
                    media_type: "game",
                  });
                }}
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
