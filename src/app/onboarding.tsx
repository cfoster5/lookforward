import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { usePostHog } from "posthog-react-native";
import { useEffect } from "react";
import {
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { iOSUIKit } from "react-native-typography";

import { IconSymbol } from "@/components/IconSymbol";
import { OnboardingScreenLayout } from "@/components/OnboardingScreenLayout";
import { useAppConfigStore } from "@/stores/appConfig";
import { useOnboardingDraft } from "@/stores/onboardingDraft";
import { colors } from "@/theme/colors";

const STAGGER_BASE = 300;
const STAGGER_STEP = 80;

const features = [
  {
    icon: "magnifyingglass" as const,
    title: "Search",
    body: "Find movies, games, cast, and\u00A0crew",
  },
  {
    icon: "timer" as const,
    title: "Countdown",
    body: "Track releases and never miss a\u00A0date",
  },
  {
    icon: "info.circle" as const,
    title: "Details",
    body: "Genres, trailers, credits, and\u00A0more",
  },
  {
    icon: "bell" as const,
    title: "Notifications",
    body: "Get reminded before releases\u00A0drop",
    onPress: () => Linking.openSettings(),
  },
];

export default function OnboardingLayout() {
  const draft = useOnboardingDraft();
  const posthog = usePostHog();
  const { completeInterestSelection, setHasSeenOnboardingModal } =
    useAppConfigStore();
  const { pickType, pickId, pickTitle } = useLocalSearchParams<{
    pickType?: string;
    pickId?: string;
    pickTitle?: string;
  }>();

  const hasMovies = draft.interests.includes("movies");
  const hasGames = draft.interests.includes("games");
  const totalSteps = 3 + (hasMovies ? 1 : 0) + (hasGames ? 1 : 0);

  useEffect(() => {
    posthog.capture("onboarding:overview_viewed");
    const timers = features.map((_, i) =>
      setTimeout(
        () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft),
        STAGGER_BASE + i * STAGGER_STEP,
      ),
    );
    return () => timers.forEach(clearTimeout);
  }, [posthog]);

  if (draft.interests.length === 0) {
    return <Redirect href="/interest-selection" />;
  }

  function handleContinue() {
    posthog.capture("onboarding:overview_continued");
    completeInterestSelection({
      interests: [...draft.interests],
      watchProviders: [...draft.watchProviders],
      gamePlatforms: [...draft.gamePlatforms],
    });
    setHasSeenOnboardingModal();
    draft.reset();
    router.replace(
      pickId
        ? {
            pathname: "/commitment",
            params: { pickType, pickId, pickTitle },
          }
        : "/commitment",
    );
  }

  return (
    <OnboardingScreenLayout
      title={"You\u2019re all\u00A0set!"}
      subtitle={"Here\u2019s what you can do with\u00A0Lookforward."}
      currentStep={totalSteps}
      totalSteps={totalSteps}
      continueEnabled
      continueColor="#3b82f6"
      scrollable={false}
      onContinue={handleContinue}
      onBack={() => router.back()}
    >
      <View style={styles.cards}>
        {features.map((feature, i) => {
          const card = (
            <View style={styles.card}>
              <View style={styles.iconContainer}>
                {Platform.OS === "ios" ? (
                  <Image
                    source={`sf:${feature.icon}`}
                    style={styles.icon}
                    tintColor={colors.secondaryLabel as string}
                  />
                ) : (
                  <IconSymbol
                    name={feature.icon}
                    size={22}
                    color={colors.secondaryLabel as string}
                  />
                )}
              </View>
              <View style={styles.cardText}>
                <Text style={[iOSUIKit.bodyEmphasized, styles.cardTitle]}>
                  {feature.title}
                </Text>
                <Text style={[iOSUIKit.subhead, styles.cardBody]}>
                  {feature.body}
                </Text>
              </View>
            </View>
          );

          return (
            <Animated.View
              key={feature.title}
              entering={FadeIn.delay(STAGGER_BASE + i * STAGGER_STEP).duration(
                100,
              )}
            >
              {feature.onPress ? (
                <Pressable
                  onPress={feature.onPress}
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                >
                  {card}
                </Pressable>
              ) : (
                card
              )}
            </Animated.View>
          );
        })}
      </View>
      <Animated.View
        entering={FadeIn.delay(
          STAGGER_BASE + features.length * STAGGER_STEP,
        ).duration(100)}
      >
        <Text style={[iOSUIKit.bodyEmphasized, styles.tagline]}>
          {"Your next release is\u00A0waiting."}
        </Text>
      </Animated.View>
    </OnboardingScreenLayout>
  );
}

const styles = StyleSheet.create({
  cards: {
    gap: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.systemGray6,
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.systemGray5,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 22,
    height: 22,
  },
  cardText: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    color: "white",
  },
  cardBody: {
    color: colors.secondaryLabel,
  },
  tagline: {
    color: colors.label,
    textAlign: "center",
    marginTop: 24,
  },
});
