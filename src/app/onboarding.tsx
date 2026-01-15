import { getAnalytics, logEvent } from "@react-native-firebase/analytics";
import { router } from "expo-router";
import { Linking, Pressable, View } from "react-native";
import RevenueCatUI from "react-native-purchases-ui";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useProOfferings } from "@/api/getProOfferings";
import { ContextMenuLink } from "@/components/ContextMenuLink";
import { LargeBorderlessButton } from "@/components/LargeBorderlessButton";
import { LargeFilledButton } from "@/components/LargeFilledButton";
import { Row } from "@/components/Row";

export default function OnboardingLayout() {
  const { top } = useSafeAreaInsets();
  const { data: pro } = useProOfferings();

  async function handlePresentProPaywall() {
    await RevenueCatUI.presentPaywall({ offering: pro });
    const analytics = getAnalytics();
    await logEvent(analytics, "select_promotion", {
      name: "Pro",
      id: "com.lookforward.pro",
    });
    // Should we dismiss the onboarding after this?
    router.dismiss();
  }

  return (
    <View style={{ marginTop: top, marginHorizontal: 16 }}>
      <ContextMenuLink href="/" isOnboarding>
        <Row
          icon="search"
          title="Find"
          body="Discover movie and game releases by searching for title, cast, or crew. Holding down on an item will give you more options. Give it a try!"
        />
      </ContextMenuLink>
      <Row
        icon="timer-outline"
        title="Countdown"
        body="Add titles to your list so you can see release dates on the Countdown tab."
      />
      <Row
        icon="information-circle-outline"
        title="Details"
        body="Tap on a title to see genres, credits, trailers, and so much more."
      />
      <Pressable onPress={() => Linking.openSettings()}>
        <Row
          icon="notifications-outline"
          title="Notifications"
          body="Allow push notifications to be reminded about releases in your list that are a week or day away."
          showDrillIn
        />
      </Pressable>
      <LargeFilledButton
        disabled={false}
        style={{ marginVertical: 16, borderRadius: 1000 }}
        handlePress={handlePresentProPaywall}
        text="Explore Pro Features"
      />
      <LargeBorderlessButton
        handlePress={() => router.dismiss()}
        text="Continue"
      />
    </View>
  );
}
