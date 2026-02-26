import {
  Button,
  Divider,
  Host,
  HStack,
  VStack,
  Text as AppleText,
  Spacer,
  Section,
} from "@expo/ui/swift-ui";
import { foregroundStyle, padding } from "@expo/ui/swift-ui/modifiers";
import {
  arrayUnion,
  doc,
  getFirestore,
  setDoc,
} from "@react-native-firebase/firestore";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useWindowDimensions } from "react-native";
import RevenueCatUI from "react-native-purchases-ui";

import { useLimitHitOffering, useProOfferings } from "@/api/getProOfferings";
import { useAuthenticatedUser } from "@/hooks/useAuthenticatedUser";
import { useAuthStore, useSubscriptionStore } from "@/stores";
import { Game, ReleaseDate } from "@/types";
import { formatGameReleaseDate } from "@/utils/dates";
import { promptForNotificationsAfterCountdownAdd } from "@/utils/notifications";
import { tryRequestReview } from "@/utils/requestReview";

type GameWithReleaseDates = Game & {
  release_dates: ReleaseDate[];
};

export default function GamePlatformPicker() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const { game: gameString } = useLocalSearchParams();
  const user = useAuthenticatedUser();
  const { isPro } = useAuthStore();
  const { hasReachedLimit } = useSubscriptionStore();
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
        await RevenueCatUI.presentPaywall({ offering: limitHit ?? pro });
        return;
      }

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
      (release_date: ReleaseDate) =>
        release_date.release_region === 2 || release_date.release_region === 8,
    ) ?? [];

  return (
    <Host matchContents={{ vertical: true }} style={{ width }}>
      <VStack modifiers={[padding({ horizontal: 16, vertical: 8 })]}>
        <Section>
          {releaseDates.flatMap((releaseDate, index) => [
            ...(index > 0
              ? [
                  <Divider
                    key={`div-${releaseDate.id}`}
                    modifiers={[padding({ vertical: 16 })]}
                  />,
                ]
              : []),
            <Button
              key={releaseDate.id}
              onPress={() => game && addGameRelease(game, releaseDate)}
            >
              <HStack>
                <AppleText modifiers={[foregroundStyle("primary")]}>
                  {releaseDate.platform.name}
                </AppleText>
                <Spacer />
                <AppleText modifiers={[foregroundStyle("secondary")]}>
                  {formatGameReleaseDate(releaseDate.date, releaseDate.human)}
                </AppleText>
              </HStack>
            </Button>,
          ])}
        </Section>
      </VStack>
    </Host>
  );
}
