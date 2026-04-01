import {
  arrayUnion,
  doc,
  getFirestore,
  setDoc,
} from "@react-native-firebase/firestore";
import * as Haptics from "expo-haptics";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CustomVariableValue } from "react-native-purchases-ui";
import { iOSUIKit } from "react-native-typography";

import { useLimitHitOffering, useProOfferings } from "@/api/getProOfferings";
import { useAuthenticatedUser } from "@/hooks/useAuthenticatedUser";
import { useAuthStore } from "@/stores/auth";
import { useSubscriptionStore } from "@/stores/subscription";
import { colors } from "@/theme/colors";
import type { Games, ReleaseDate } from "@/types/igdb";
import { formatGameReleaseDate } from "@/utils/dates";
import { promptForNotificationsAfterCountdownAdd } from "@/utils/notifications";
import { presentPaywallWithRestoreAlert } from "@/utils/paywall";
import { tryRequestReview } from "@/utils/requestReview";

type GameWithReleaseDates = Games & {
  release_dates: ReleaseDate[];
};

const Separator = () => <View style={styles.separator} />;

export default function GamePlatformPicker() {
  const router = useRouter();
  const { game: gameString } = useLocalSearchParams();
  const user = useAuthenticatedUser();
  const isPro = useAuthStore((s) => s.isPro);
  const hasReachedLimit = useSubscriptionStore((s) => s.hasReachedLimit);
  const { data: pro } = useProOfferings();
  const { data: limitHit } = useLimitHitOffering();

  const game = gameString
    ? (JSON.parse(gameString as string) as GameWithReleaseDates)
    : null;

  async function addGameRelease(
    game: GameWithReleaseDates,
    releaseDate: ReleaseDate,
  ) {
    const { id, name } = game;
    try {
      if (hasReachedLimit(isPro)) {
        await presentPaywallWithRestoreAlert({
          offering: limitHit ?? pro,
          customVariables: name
            ? { item_name: CustomVariableValue.string(name) }
            : undefined,
        });
        return;
      }

      const db = getFirestore();
      const docRef = doc(db, "gameReleases", String(releaseDate.id));
      await setDoc(
        docRef,
        {
          game: { id, name },
          subscribers: arrayUnion(user.uid),
        },
        { merge: true },
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await promptForNotificationsAfterCountdownAdd(user.uid);
      await tryRequestReview();
      router.back();
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  }

  const releaseDates =
    game?.release_dates?.filter(
      (releaseDate: ReleaseDate) =>
        releaseDate.release_region === 2 || releaseDate.release_region === 8,
    ) ?? [];

  const renderItem: ListRenderItem<ReleaseDate> = ({ item }) => (
    <Pressable
      style={styles.row}
      onPress={() => game && addGameRelease(game, item)}
    >
      <Text style={styles.platformName}>{item.platform.name}</Text>
      <Text style={styles.releaseDate}>
        {formatGameReleaseDate(item.date ?? null, item.human ?? "")}
      </Text>
    </Pressable>
  );

  return (
    <>
      <Stack.Screen options={{ title: game?.name ?? "Select Platform" }} />
      <FlatList
        data={releaseDates}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        ItemSeparatorComponent={Separator}
        scrollEnabled={false}
        contentContainerStyle={styles.content}
        style={styles.container}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    // paddingVertical: 8,
    paddingBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    minHeight: 44,
  },
  platformName: {
    ...iOSUIKit.bodyObject,
    color: colors.label,
  },
  releaseDate: {
    ...iOSUIKit.footnoteObject,
    color: colors.secondaryLabel,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.separator,
  },
});
