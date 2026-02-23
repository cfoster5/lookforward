import { router } from "expo-router";
import { usePostHog } from "posthog-react-native";
import { Linking, Pressable, View } from "react-native";
import Purchases from "react-native-purchases";
import RevenueCatUI from "react-native-purchases-ui";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useProOfferings } from "@/api/getProOfferings";
import { ContextMenuLink } from "@/components/ContextMenuLink";
import { LargeFilledButton } from "@/components/LargeFilledButton";
import { Row } from "@/components/Row";

export default function OnboardingLayout() {
  const { top } = useSafeAreaInsets();
  const { data: pro } = useProOfferings();
  const posthog = usePostHog();

  async function handlePresentProPaywall() {
    if (!pro) {
      posthog.capture("onboarding:paywall_error", {
        reason: "offering_missing",
      });
      handleContinue();
      return;
    }

    try {
      // Track CTA tap and paywall view BEFORE presenting
      posthog.capture("onboarding:cta_tap", { button: "explore_pro" });
      posthog.capture("onboarding:paywall_view", { type: "pro" });
      posthog.capture("paywall:viewed", { source: "onboarding" });

      await RevenueCatUI.presentPaywall({ offering: pro });

      // Check if user converted after paywall was dismissed
      const customerInfo = await Purchases.getCustomerInfo();
      const converted = !!customerInfo.entitlements.active.pro;
      posthog.capture("onboarding:paywall_dismiss", { converted });

      posthog.capture("onboarding:complete", { converted });
      router.dismiss();
    } catch (error) {
      posthog.capture("onboarding:paywall_error", {
        reason: "presentation_failed",
        message: error instanceof Error ? error.message : String(error),
      });
      handleContinue();
    }
  }

  function handleContinue() {
    posthog.capture("onboarding:cta_tap", { button: "continue" });
    posthog.capture("onboarding:complete", { converted: false });
    router.dismiss();
  }

  return (
    <View style={{ marginTop: top, marginHorizontal: 16 }}>
      <ContextMenuLink href="/" isOnboarding>
        <Row
              icon="sf:magnifyingglass"
          title="Find"
          body="Discover movie and game releases by searching for title, cast, or crew. Holding down on an item will give you more options. Give it a try!"
        />
      </ContextMenuLink>
      <Row
          icon="sf:timer"
        title="Countdown"
        body="Add titles to your list so you can see release dates on the Countdown tab."
      />
      <Row
          icon="sf:info.circle"
        title="Details"
        body="Tap on a title to see genres, credits, trailers, and so much more."
      />
      <Pressable onPress={() => Linking.openSettings()}>
        <Row
            icon="sf:bell"
          title="Notifications"
          body="Allow push notifications to be reminded about releases in your list that are a week or day away."
          showDrillIn
        />
      </Pressable>
      <LargeFilledButton
        disabled={false}
        style={{ marginVertical: 16, borderRadius: 1000 }}
        handlePress={handlePresentProPaywall}
        text="Continue"
      />
      {/* <LargeBorderlessButton handlePress={handleContinue} text="Continue" /> */}
    </View>
  );
}
