import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { InterestOption } from "@/components/InterestOption";
import { OnboardingScreenLayout } from "@/components/OnboardingScreenLayout";
import { useOnboardingDraft } from "@/stores/onboardingDraft";

const STAGGER_BASE = 300;
const STAGGER_STEP = 80;
const OPTIONS = ["movies", "games"] as const;

export default function InterestSelectionScreen() {
  const router = useRouter();
  const { interests, toggleInterest } = useOnboardingDraft();

  const hasMovies = interests.includes("movies");
  const hasGames = interests.includes("games");
  const totalSteps = 2 + (hasMovies ? 1 : 0) + (hasGames ? 1 : 0);

  useEffect(() => {
    const timers = OPTIONS.map((_, i) =>
      setTimeout(
        () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft),
        STAGGER_BASE + i * STAGGER_STEP,
      ),
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  function handleContinue() {
    if (hasMovies) {
      router.push("/watch-providers");
    } else {
      router.push("/game-platforms");
    }
  }

  return (
    <OnboardingScreenLayout
      title="What are you into?"
      subtitle={"Pick what you want to track. You can change this\u00A0later."}
      currentStep={1}
      totalSteps={totalSteps}
      continueEnabled={interests.length > 0}
      onContinue={handleContinue}
    >
      <View style={styles.options}>
        <Animated.View
          entering={FadeIn.delay(STAGGER_BASE).duration(100)}
        >
          <InterestOption
            label="Movies"
            selected={hasMovies}
            onPress={() => toggleInterest("movies")}
          />
        </Animated.View>
        <Animated.View
          entering={FadeIn.delay(STAGGER_BASE + STAGGER_STEP).duration(100)}
        >
          <InterestOption
            label="Video Games"
            selected={hasGames}
            onPress={() => toggleInterest("games")}
          />
        </Animated.View>
      </View>
    </OnboardingScreenLayout>
  );
}

const styles = StyleSheet.create({
  options: {
    gap: 12,
    marginTop: 8,
  },
});
