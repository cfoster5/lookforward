import React, { RefObject, useContext } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { Modalize } from "react-native-modalize";
import { IHandles } from "react-native-modalize/lib/options";
import { iOSUIKit } from "react-native-typography";
import firestore from "@react-native-firebase/firestore";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import GameContext from "../contexts/GamePlatformPickerContexts";
import TabStackContext from "../contexts/TabStackContext";
import { reusableStyles } from "../helpers/styles";
import { IGDB } from "../interfaces/igdb";

function GamePlatformPicker({
  modalizeRef,
  game,
}: {
  modalizeRef: RefObject<IHandles>;
  game: IGDB.Game.Game;
}) {
  const { user, theme } = useContext(TabStackContext);
  const { setGame } = useContext(GameContext);
  const tabBarheight = useBottomTabBarHeight();

  function formatDate(item: IGDB.Game.ReleaseDate) {
    let date = new Date(item.date * 1000);
    let monthIndex = new Date(date).getUTCMonth();
    // return `${months[monthIndex].toUpperCase()} ${date.getUTCDate()}, ${new Date(date).getUTCFullYear()}`
    return `${(monthIndex + 1).toString().length < 2 ? "0" : ""}${
      monthIndex + 1
    }/${
      date.getUTCDate().toString().length < 2 ? "0" : ""
    }${date.getUTCDate()}/${new Date(date).getUTCFullYear()}`;
  }

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
                  {formatDate(releaseDate)}
                </Text>
              </View>
            </Pressable>
          )
      )}
    </Modalize>
  );
}

export default GamePlatformPicker;
