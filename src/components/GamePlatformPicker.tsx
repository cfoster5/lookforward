import React, { RefObject, useContext } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { Modalize } from "react-native-modalize";
import { iOSUIKit } from "react-native-typography";
import firestore from "@react-native-firebase/firestore";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { DateTime } from "luxon";

import GameContext from "../contexts/GamePlatformPickerContexts";
import TabStackContext from "../contexts/TabStackContext";
import { reusableStyles } from "../helpers/styles";
import { IGDB } from "../interfaces/igdb";

function GamePlatformPicker({
  modalizeRef,
  game,
}: {
  modalizeRef: RefObject<Modalize>;
  game: IGDB.Game.Game;
}) {
  const { user, theme } = useContext(TabStackContext);
  const { setGame } = useContext(GameContext);
  const tabBarheight = useBottomTabBarHeight();

  async function addGameRelease(releaseDate: IGDB.Game.ReleaseDate) {
    // console.log("releaseDate", releaseDate);
    let tempGame = {
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
          subscribers: firestore.FieldValue.arrayUnion(user),
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
      adjustToContentHeight={true}
      childrenStyle={{
        marginBottom: Platform.OS === "ios" ? tabBarheight + 16 : 16,
      }}
      modalStyle={theme === "dark" ? { backgroundColor: "#121212" } : {}}
      onClosed={() => setGame(null)}
    >
      {game?.release_dates.map(
        (releaseDate, i) =>
          (releaseDate.region === 2 || releaseDate.region === 8) && (
            <Pressable
              key={i}
              onPress={() => addGameRelease(releaseDate)}
              style={{
                marginHorizontal: 16,
                marginTop: 16,
                paddingBottom:
                  i <
                  game.release_dates.filter(
                    (releaseDate) =>
                      releaseDate.region === 2 || releaseDate.region === 8
                  ).length -
                    1
                    ? 16
                    : 0,
                borderBottomWidth:
                  i <
                  game.release_dates.filter(
                    (releaseDate) =>
                      releaseDate.region === 2 || releaseDate.region === 8
                  ).length -
                    1
                    ? StyleSheet.hairlineWidth
                    : 0,
                borderColor:
                  i <
                  game.release_dates.filter(
                    (releaseDate) =>
                      releaseDate.region === 2 || releaseDate.region === 8
                  ).length -
                    1
                    ? "#3c3d41"
                    : undefined,
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={theme === "dark" ? iOSUIKit.bodyWhite : iOSUIKit.body}
                >
                  {releaseDate.platform.name}
                </Text>
                <Text style={reusableStyles.date}>
                  {DateTime.fromSeconds(releaseDate.date)
                    .toUTC()
                    .toFormat("MM/dd/yyyy")}
                </Text>
              </View>
            </Pressable>
          )
      )}
    </Modalize>
  );
}

export default GamePlatformPicker;
