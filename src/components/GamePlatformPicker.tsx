import firestore from "@react-native-firebase/firestore";
import React from "react";
import {
  FlatList,
  PlatformColor,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { iOSUIKit } from "react-native-typography";

import { DynamicHeightModal } from "./DynamicHeightModal";
import { reusableStyles } from "../helpers/styles";

import { useStore } from "@/stores/store";
import { ReleaseDate } from "@/types";
import { timestampToUTC } from "@/utils/dates";

type RenderItemProps = {
  handlePress: () => void;
  releaseDate: ReleaseDate;
};

const RenderItem = ({ handlePress, releaseDate }: RenderItemProps) => (
  <Pressable
    onPress={handlePress}
    style={{
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      minHeight: 44,
      alignItems: "center",
    }}
  >
    {/* <Text style={theme === "dark" ? iOSUIKit.bodyWhite : iOSUIKit.body}> */}
    <Text style={iOSUIKit.bodyWhite}>{releaseDate.platform.name}</Text>
    <Text style={reusableStyles.date}>
      {timestampToUTC(releaseDate.date).toFormat("MM/dd/yyyy")}
    </Text>
  </Pressable>
);

export function GamePlatformPicker() {
  const { user, bottomSheetModalRef, game } = useStore();
  const { bottom: safeBottomArea } = useSafeAreaInsets();

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
      bottomSheetModalRef.current?.dismiss();
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  }

  return (
    <DynamicHeightModal modalRef={bottomSheetModalRef}>
      <FlatList
        data={game?.release_dates.filter(
          (release_date) =>
            release_date.region === 2 || release_date.region === 8
        )}
        renderItem={({ item: releaseDate }) => (
          <RenderItem
            key={releaseDate.id}
            handlePress={() => addGameRelease(releaseDate)}
            releaseDate={releaseDate}
          />
        )}
        ItemSeparatorComponent={() => (
          <View
            style={{
              marginVertical: 4,
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderColor: PlatformColor("separator"),
            }}
          />
        )}
        scrollEnabled={false}
        style={{ paddingBottom: safeBottomArea, paddingHorizontal: 16 }}
      />
    </DynamicHeightModal>
  );
}
