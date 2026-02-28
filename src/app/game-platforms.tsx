import * as Haptics from "expo-haptics";
import { Redirect, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { useGamePlatforms } from "@/api/getGamePlatforms";
import { OnboardingScreenLayout } from "@/components/OnboardingScreenLayout";
import { SelectionChip } from "@/components/SelectionChip";
import { useOnboardingDraft } from "@/stores/onboardingDraft";

const STAGGER_BASE = 300;
const STAGGER_STEP = 80;

export default function GamePlatformsScreen() {
  const router = useRouter();
  const { interests, gamePlatforms, toggleGamePlatform } = useOnboardingDraft();
  const { data: platforms, isLoading } = useGamePlatforms();

  const visible = platforms ?? [];

  useEffect(() => {
    if (visible.length === 0) return;
    const timers = visible.map((_, i) =>
      setTimeout(
        () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft),
        STAGGER_BASE + i * STAGGER_STEP,
      ),
    );
    return () => timers.forEach(clearTimeout);
  }, [visible.length]);

  if (!interests.includes("games")) {
    return <Redirect href="/interest-selection" />;
  }

  const hasMovies = interests.includes("movies");
  const totalSteps = 2 + (hasMovies ? 1 : 0) + 1;
  const currentStep = totalSteps - 1;

  function handleContinue() {
    router.push("/onboarding");
  }

  return (
    <OnboardingScreenLayout
      title="Where do you play?"
      subtitle={
        "Select your gaming platforms to help us tailor filters to your preferences. You can change this\u00A0later."
      }
      currentStep={currentStep}
      totalSteps={totalSteps}
      continueEnabled
      onContinue={handleContinue}
      onBack={() => router.back()}
    >
      {isLoading ? (
        <ActivityIndicator style={styles.loader} />
      ) : (
        <View style={styles.chips}>
          {visible.map((platform, i) => (
            <Animated.View
              key={platform.id}
              entering={FadeIn.delay(STAGGER_BASE + i * STAGGER_STEP).duration(
                100,
              )}
            >
              <SelectionChip
                label={platform.name}
                selected={gamePlatforms.includes(platform.id)}
                onPress={() => toggleGamePlatform(platform.id)}
              />
            </Animated.View>
          ))}
        </View>
      )}
    </OnboardingScreenLayout>
  );
}

const styles = StyleSheet.create({
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    marginTop: 8,
  },
  loader: {
    marginTop: 32,
  },
});
