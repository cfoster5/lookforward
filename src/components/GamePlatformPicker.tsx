import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import {
  getFirestore,
  doc,
  setDoc,
  arrayUnion,
} from "@react-native-firebase/firestore";
import * as Haptics from "expo-haptics";
import { PlatformColor, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { iOSUIKit } from "react-native-typography";

import { useCountdownLimit } from "@/hooks/useCountdownLimit";
import { useStore } from "@/stores/store";
import { Games, ReleaseDate } from "@/types/igdb";
import { timestampToUTC } from "@/utils/dates";

import { reusableStyles } from "../helpers/styles";

import { DynamicHeightModal } from "./DynamicHeightModal";

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
      {/* Crashing here
      fromSeconds requires a numerical input */}
      {releaseDate.date
        ? timestampToUTC(releaseDate.date).toFormat("MM/dd/yyyy")
        : releaseDate.human}
    </Text>
  </Pressable>
);

const ItemSeparator = () => (
  <View
    style={{
      marginVertical: 4,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: PlatformColor("separator"),
    }}
  />
);

export function GamePlatformPicker() {
  const { user, bottomSheetModalRef } = useStore();
  const checkLimit = useCountdownLimit();
  const { bottom: safeBottomArea } = useSafeAreaInsets();

  async function addGameRelease(
    game: Games & {
      release_dates: ReleaseDate[];
    },
    releaseDate: ReleaseDate,
  ) {
    // Check limit before adding
    if (!checkLimit("gameReleases")) {
      bottomSheetModalRef.current?.dismiss();
      return; // Limit reached, modal shown
    }

    // console.log("releaseDate", releaseDate);
    // console.log(game);
    const { id, name } = game;
    try {
      const db = getFirestore();
      const docRef = doc(db, "gameReleases", releaseDate.id?.toString() || "");
      await setDoc(
        docRef,
        { game: { id, name }, subscribers: arrayUnion(user!.uid) },
        { merge: true },
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      bottomSheetModalRef.current?.dismiss();
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  }

  return (
    <DynamicHeightModal modalRef={bottomSheetModalRef}>
      {({ data }) => (
        <BottomSheetFlatList
          // need to filter client-side since combining search and filter on API is not working
          data={data?.release_dates.filter(
            (release_date) =>
              release_date.region === 2 || release_date.region === 8,
          )}
          renderItem={({ item: releaseDate }) => (
            <RenderItem
              key={releaseDate.id}
              handlePress={() => addGameRelease(data, releaseDate)}
              releaseDate={releaseDate}
            />
          )}
          ItemSeparatorComponent={ItemSeparator}
          scrollEnabled={false}
          contentContainerStyle={{
            paddingBottom: safeBottomArea,
            paddingHorizontal: 16,
          }}
        />
      )}
    </DynamicHeightModal>
  );
}
