import * as Colors from "@bacons/apple-colors";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import {
  arrayUnion,
  doc,
  getFirestore,
  setDoc,
} from "@react-native-firebase/firestore";
import { Pressable, StyleSheet, Text, View } from "react-native";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { iOSUIKit } from "react-native-typography";

import { useAuthenticatedUser } from "@/hooks/useAuthenticatedUser";
import { useInterfaceStore } from "@/stores";
import { Game, ReleaseDate } from "@/types";
import { formatGameReleaseDate } from "@/utils/dates";
import { tryRequestReview } from "@/utils/requestReview";

import { reusableStyles } from "../helpers/styles";

import { CustomBottomSheetModal } from "./CustomBottomSheetModal";

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
    <Text style={iOSUIKit.bodyWhite}>{releaseDate.platform.name}</Text>
    <Text style={reusableStyles.date}>
      {formatGameReleaseDate(releaseDate.date, releaseDate.human)}
    </Text>
  </Pressable>
);

const ItemSeparator = () => (
  <View
    style={{
      marginVertical: 4,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: Colors.separator,
    }}
  />
);

export function GamePlatformPicker() {
  const user = useAuthenticatedUser();
  const { bottomSheetModalRef } = useInterfaceStore();
  const { bottom: safeBottomArea } = useSafeAreaInsets();

  async function addGameRelease(
    game: Game & {
      release_dates: ReleaseDate[];
    },
    releaseDate: ReleaseDate,
  ) {
    const { id, name } = game;
    try {
      const db = getFirestore();
      const docRef = doc(db, "gameReleases", releaseDate.id.toString());
      await setDoc(
        docRef,
        {
          game: { id, name },
          subscribers: arrayUnion(user.uid),
        },
        { merge: true },
      );
      ReactNativeHapticFeedback.trigger("impactLight", {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      });
      await tryRequestReview();
      bottomSheetModalRef.current?.dismiss();
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  }

  return (
    <CustomBottomSheetModal modalRef={bottomSheetModalRef}>
      {({ data }) => (
        <BottomSheetFlatList
          // need to filter client-side since combining search and filter on API is not working
          data={data?.release_dates.filter(
            (release_date) =>
              release_date.release_region === 2 ||
              release_date.release_region === 8,
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
    </CustomBottomSheetModal>
  );
}
