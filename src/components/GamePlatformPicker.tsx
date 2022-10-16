import firestore from "@react-native-firebase/firestore";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { DateTime } from "luxon";
import React, { RefObject, useContext } from "react";
import {
  Platform,
  PlatformColor,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { Modalize } from "react-native-modalize";
import { iOSUIKit } from "react-native-typography";

import TabStackContext from "../contexts/TabStackContext";
import { reusableStyles } from "../helpers/styles";
import { IGDB } from "../interfaces/igdb";

import { useStore } from "@/stores/store";

type Props = {
  handlePress: () => void;
  releaseDate: IGDB.Game.ReleaseDate;
};

const RenderItem = ({ handlePress, releaseDate }: Props) => (
  <Pressable
    onPress={handlePress}
    style={{
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
    }}
  >
    {/* <Text style={theme === "dark" ? iOSUIKit.bodyWhite : iOSUIKit.body}> */}
    <Text style={iOSUIKit.bodyWhite}>{releaseDate.platform.name}</Text>
    <Text style={reusableStyles.date}>
      {DateTime.fromSeconds(releaseDate.date).toUTC().toFormat("MM/dd/yyyy")}
    </Text>
  </Pressable>
);

function GamePlatformPicker({
  modalizeRef,
  game,
}: {
  modalizeRef: RefObject<Modalize>;
  game: IGDB.Game.Game;
}) {
  const { user, setGame } = useStore();
  const { theme } = useContext(TabStackContext);
  const tabBarheight = useBottomTabBarHeight();

  async function addGameRelease(releaseDate: IGDB.Game.ReleaseDate) {
    // console.log("releaseDate", releaseDate);
    const tempGame = {
      cover: game.cover,
      id: game.id,
      name: game.name,
      summary: game.summary,
    };
    // console.log(game);
    releaseDate.game = tempGame;
    try {
      await firestore()
        .collection("gameReleases")
        .doc(releaseDate.id.toString())
        .set(releaseDate, { merge: true });
      await firestore()
        .collection("gameReleases")
        .doc(releaseDate.id.toString())
        .update({
          subscribers: firestore.FieldValue.arrayUnion(user!.uid),
        });
      ReactNativeHapticFeedback.trigger("impactLight", {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      });
      modalizeRef.current?.close();
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  }

  return (
    <Modalize
      ref={modalizeRef}
      adjustToContentHeight
      flatListProps={{
        data: game?.release_dates.filter(
          (release_date) =>
            release_date.region === 2 || release_date.region === 8
        ),
        renderItem: ({ item }: { item: IGDB.Game.ReleaseDate }) => (
          <RenderItem
            handlePress={() => addGameRelease(item)}
            releaseDate={item}
          />
        ),
        ItemSeparatorComponent: () => (
          <View
            style={{
              marginVertical: 16,
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderColor: PlatformColor("separator"),
            }}
          />
        ),
        keyExtractor: (item: IGDB.Game.ReleaseDate) => item.id.toString(),
        showsVerticalScrollIndicator: false,
      }}
      childrenStyle={{
        marginBottom: Platform.OS === "ios" ? tabBarheight + 16 : 16,
      }}
      modalStyle={{
        backgroundColor: PlatformColor("secondarySystemBackground"),
        paddingHorizontal: 16,
        paddingVertical: 16,
      }}
      onClosed={() => setGame(null)}
    />
  );
}

export default GamePlatformPicker;
