import * as Haptics from "expo-haptics";
import { Redirect, useRouter, Color } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { iOSUIKit } from "react-native-typography";

import { useMovieWatchProviders } from "@/api/getMovieWatchProviders";
import { OnboardingScreenLayout } from "@/components/OnboardingScreenLayout";
import { SelectionChip } from "@/components/SelectionChip";
import { useOnboardingDraft } from "@/stores/onboardingDraft";

const STAGGER_BASE = 300;
const STAGGER_STEP = 80;
const INITIAL_COUNT = 10;

export default function WatchProvidersScreen() {
  const router = useRouter();
  const { interests, watchProviders, toggleWatchProvider } =
    useOnboardingDraft();
  const { data: providers, isLoading } = useMovieWatchProviders();

  const [showAll, setShowAll] = useState(false);
  const allProviders = providers ?? [];
  const visible = showAll ? allProviders : allProviders.slice(0, INITIAL_COUNT);

  useEffect(() => {
    if (allProviders.length === 0) return;
    const initial = allProviders.slice(0, INITIAL_COUNT);
    const timers = initial.map((_, i) =>
      setTimeout(
        () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft),
        STAGGER_BASE + i * STAGGER_STEP,
      ),
    );
    return () => timers.forEach(clearTimeout);
  }, [allProviders.length]);

  if (!interests.includes("movies")) {
    return <Redirect href="/interest-selection" />;
  }

  const hasGames = interests.includes("games");
  const totalSteps = 2 + 1 + (hasGames ? 1 : 0);

  function handleContinue() {
    if (hasGames) {
      router.push("/game-platforms");
    } else {
      router.push("/onboarding");
    }
  }

  return (
    <OnboardingScreenLayout
      title="Where do you watch?"
      subtitle={
        "Select your streaming services to help us tailor filters to your preferences. You can change this\u00A0later."
      }
      currentStep={2}
      totalSteps={totalSteps}
      continueEnabled
      onContinue={handleContinue}
      onBack={() => router.back()}
    >
      {isLoading ? (
        <ActivityIndicator style={styles.loader} />
      ) : (
        <>
          <View style={styles.chips}>
            {visible.map((provider, i) =>
              i < INITIAL_COUNT ? (
                <Animated.View
                  key={provider.provider_id}
                  entering={FadeIn.delay(
                    STAGGER_BASE + i * STAGGER_STEP,
                  ).duration(100)}
                >
                  <SelectionChip
                    label={provider.provider_name}
                    selected={watchProviders.includes(provider.provider_id)}
                    onPress={() => toggleWatchProvider(provider.provider_id)}
                  />
                </Animated.View>
              ) : (
                <SelectionChip
                  key={provider.provider_id}
                  label={provider.provider_name}
                  selected={watchProviders.includes(provider.provider_id)}
                  onPress={() => toggleWatchProvider(provider.provider_id)}
                />
              ),
            )}
          </View>
          {!showAll && allProviders.length > INITIAL_COUNT && (
            <Animated.View
              entering={FadeIn.delay(
                STAGGER_BASE + INITIAL_COUNT * STAGGER_STEP,
              ).duration(100)}
            >
              <Pressable
                onPress={() => setShowAll(true)}
                style={({ pressed }) => [
                  styles.showMore,
                  { opacity: pressed ? 0.5 : 1 },
                ]}
              >
                <Text style={[iOSUIKit.subhead, styles.showMoreText]}>
                  Show More
                </Text>
              </Pressable>
            </Animated.View>
          )}
        </>
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
  showMore: {
    alignSelf: "center",
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  showMoreText: {
    color: Color.ios.secondaryLabel,
  },
  loader: {
    marginTop: 32,
  },
});
