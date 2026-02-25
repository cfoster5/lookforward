import { Color } from "expo-router";
import { usePostHog } from "posthog-react-native";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";
import { iOSUIKit } from "react-native-typography";

import { useLimitHitOffering, useProOfferings } from "@/api/getProOfferings";
import { IconSymbol } from "@/components/IconSymbol";
import { useAuthStore } from "@/stores";
import {
  FREE_TIER_COUNTDOWN_LIMIT,
  useSubscriptionStore,
} from "@/stores/subscription";

type CountdownLimitBannerProps = {
  showOnEmpty?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const CountdownLimitBanner = ({
  showOnEmpty = false,
  style,
}: CountdownLimitBannerProps) => {
  const { isPro } = useAuthStore();
  const { movieSubs, gameSubs } = useSubscriptionStore();
  const { data: pro } = useProOfferings();
  const { data: limitHit } = useLimitHitOffering();
  const posthog = usePostHog();

  const iconSize = iOSUIKit.bodyObject.fontSize;

  const totalCountdowns = movieSubs.length + gameSubs.length;

  // Don't show for Pro users
  if (isPro) return null;

  // If not showing on empty state, hide when fewer than 4 countdowns
  if (!showOnEmpty && totalCountdowns < FREE_TIER_COUNTDOWN_LIMIT - 1)
    return null;

  const isAtLimit = totalCountdowns >= FREE_TIER_COUNTDOWN_LIMIT;
  const remaining = FREE_TIER_COUNTDOWN_LIMIT - totalCountdowns;

  // Determine message based on state
  let mainMessage: string;
  if (totalCountdowns === 0) {
    mainMessage = `${FREE_TIER_COUNTDOWN_LIMIT} free countdowns available`;
  } else if (isAtLimit) {
    mainMessage = "Countdown limit reached";
  } else {
    // TODO: Use Intl.PluralRules when available in React Native
    mainMessage = `${remaining} free countdown${remaining === 1 ? "" : "s"} remaining`;
  }

  return (
    <Pressable
      onPress={async () => {
        if (isAtLimit && limitHit) {
          posthog.capture("limit:paywall_view");
        } else {
          posthog.capture("countdown:paywall_view", { type: "pro" });
        }
        const result = await RevenueCatUI.presentPaywall({
          offering: isAtLimit ? limitHit ?? pro : pro,
        });
        if (
          isAtLimit &&
          limitHit &&
          result === PAYWALL_RESULT.CANCELLED
        ) {
          posthog.capture("limit:paywall_dismiss");
        }
      }}
      style={[
        {
          backgroundColor: Color.ios.secondarySystemBackground,
          paddingVertical: 10,
          paddingHorizontal: 16,
          marginBottom: 16,
          borderRadius: 10,
          flexDirection: "row",
          alignItems: "center",
        },
        style,
      ]}
    >
      {/* Invisible spacer to balance right chevron and center content */}
      <View style={{ width: iconSize }} />
      <View style={{ paddingLeft: 16, flex: 1, alignItems: "center" }}>
        <Text style={[iOSUIKit.footnoteEmphasized, { color: Color.ios.label }]}>
          {/* {mainMessage} */}
          Get more countdowns with Pro
        </Text>
        <Text style={[iOSUIKit.footnote, { color: Color.ios.secondaryLabel }]}>
          {/* Get more with LookForward Pro */}
          {mainMessage}
        </Text>
      </View>
      <IconSymbol
        name="chevron.forward"
        size={iconSize}
        color={Color.ios.tertiaryLabel as string}
      />
    </Pressable>
  );
};
