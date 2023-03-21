import firestore from "@react-native-firebase/firestore";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { DateTime } from "luxon";
import React, { RefObject, useContext, useEffect } from "react";
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

import { useStore } from "@/stores/store";
import { Game, ReleaseDate } from "@/types";

type Props = {
  handlePress: () => void;
  releaseDate: ReleaseDate;
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

export function GamePlatformPicker({
  modalizeRef,
  game,
}: {
  modalizeRef: RefObject<Modalize>;
  game: Game & {
    release_dates: ReleaseDate[];
  };
}) {
  const { user, setGame } = useStore();
  const { theme } = useContext(TabStackContext);
  const tabBarheight = useBottomTabBarHeight();

  useEffect(() => {
    if (!game) modalizeRef.current?.close();
  }, [game]);

  async function addGameRelease(releaseDate: ReleaseDate) {
    // console.log("releaseDate", releaseDate);
    // console.log(game);
    const { id, name, cover, summary } = game;
    try {
      await firestore()
        .collection("gameReleases")
        .doc(releaseDate.id.toString())
        .set(
          {
            ...releaseDate,
            game: { cover, id, name, summary },
            subscribers: firestore.FieldValue.arrayUnion(user!.uid),
          },
          { merge: true }
        );
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
        renderItem: ({ item }: { item: ReleaseDate }) => (
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
        keyExtractor: (item: ReleaseDate) => item.id.toString(),
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
