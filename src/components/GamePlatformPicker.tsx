import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFlatList,
  BottomSheetModal,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";
import firestore from "@react-native-firebase/firestore";
import { DateTime } from "luxon";
import React, { useCallback, useMemo } from "react";
import { PlatformColor, Pressable, StyleSheet, Text, View } from "react-native";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { iOSUIKit } from "react-native-typography";

import { reusableStyles } from "../helpers/styles";

import { useStore } from "@/stores/store";
import { ReleaseDate } from "@/types";

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
      minHeight: 44,
      alignItems: "center",
    }}
  >
    {/* <Text style={theme === "dark" ? iOSUIKit.bodyWhite : iOSUIKit.body}> */}
    <Text style={iOSUIKit.bodyWhite}>{releaseDate.platform.name}</Text>
    <Text style={reusableStyles.date}>
      {DateTime.fromSeconds(releaseDate.date).toUTC().toFormat("MM/dd/yyyy")}
    </Text>
  </Pressable>
);

export function GamePlatformPicker() {
  const { user, bottomSheetModalRef, game } = useStore();
  const { bottom: safeBottomArea } = useSafeAreaInsets();
  const snapPoints = useMemo(() => ["CONTENT_HEIGHT"], []);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(snapPoints);

  async function addGameRelease(releaseDate: ReleaseDate) {
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
      bottomSheetModalRef.current?.dismiss();
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  }

  // renders
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      snapPoints={animatedSnapPoints}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: PlatformColor("secondarySystemBackground"),
      }}
      handleIndicatorStyle={{
        backgroundColor: PlatformColor("systemGray"),
      }}
      style={{ paddingHorizontal: 16 }}
    >
      <BottomSheetFlatList
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
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderColor: PlatformColor("separator"),
            }}
          />
        )}
        onLayout={handleContentLayout}
        scrollEnabled={false}
        style={{ paddingBottom: safeBottomArea }}
      />
    </BottomSheetModal>
  );
}
