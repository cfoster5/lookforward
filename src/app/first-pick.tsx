import Ionicons from "@expo/vector-icons/Ionicons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { iOSUIKit } from "react-native-typography";
import { PosterSize } from "tmdb-ts";

import { CircularProgress } from "@/components/CircularProgress";
import { useDiscoverGames } from "@/screens/GameDiscover/api/getDiscoverGames";
import { useDiscoverMovies } from "@/screens/MovieDiscover/api/getDiscoverMovies";
import { useOnboardingDraft } from "@/stores/onboardingDraft";
import { colors } from "@/theme/colors";

const SPACING = 16;
const GAP = 6;
const STAGGER_BASE = 300;
const STAGGER_STEP = 80;

type NormalizedPick = {
  id: string;
  title: string;
  imageUri: string | null;
  type: "movie" | "game";
};

function navigateToPick(pick: NormalizedPick | null) {
  if (pick) {
    router.push({
      pathname: "/onboarding",
      params: {
        pickType: pick.type,
        pickId: pick.id,
        pickTitle: pick.title,
      },
    });
  } else {
    router.push("/onboarding");
  }
}

export default function FirstPickScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const { interests } = useOnboardingDraft();
  const hasMovies = interests.includes("movies");
  const hasGames = interests.includes("games");
  const totalSteps = 3 + (hasMovies ? 1 : 0) + (hasGames ? 1 : 0);
  const currentStep = totalSteps - 1;

  const { data: movies, isLoading: moviesLoading } = useDiscoverMovies({
    sortMethod: "popularity.desc",
    watchProvider: 0,
    primaryReleaseDateGte: new Date().toISOString().split("T")[0],
    language: "en",
    region: "US",
    includeAdult: false,
    includeVideo: false,
    withOriginalLanguage: "en",
  });
  const { data: games, isLoading: gamesLoading } = useDiscoverGames({});

  const isLoading = hasMovies ? moviesLoading : gamesLoading;

  const items: NormalizedPick[] = hasMovies
    ? (movies ?? []).slice(0, 15).map((movie) => ({
        id: movie.id.toString(),
        title: movie.title,
        imageUri: movie.poster_path
          ? `https://image.tmdb.org/t/p/${PosterSize.W300}${movie.poster_path}`
          : null,
        type: "movie" as const,
      }))
    : (games ?? []).slice(0, 15).map((game) => ({
        id: game.id.toString(),
        title: game.name,
        imageUri: game.cover?.url
          ? `https:${game.cover.url.replace("thumb", "cover_big_2x")}`
          : null,
        type: "game" as const,
      }));

  const rows: NormalizedPick[][] = [];
  for (let i = 0; i < items.length; i += 3) {
    rows.push(items.slice(i, i + 3));
  }

  useEffect(() => {
    if (isLoading || items.length === 0) return;
    const numRows = Math.ceil(items.length / 3);
    const timers = Array.from({ length: numRows }, (_, i) =>
      setTimeout(
        () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft),
        STAGGER_BASE + i * STAGGER_STEP,
      ),
    );
    return () => timers.forEach(clearTimeout);
  }, [isLoading, items.length]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center, { paddingTop: top }]}>
        <ActivityIndicator color="white" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          style={({ pressed }) => [
            styles.backButton,
            { opacity: pressed ? 0.5 : 1 },
          ]}
        >
          <Ionicons name="chevron-back" size={28} color="white" />
        </Pressable>
        <CircularProgress currentStep={currentStep} totalSteps={totalSteps} />
      </View>
      <Text style={[iOSUIKit.largeTitleEmphasized, styles.title]}>
        {"What are you\nlooking\u00A0forward\u00A0to?"}
      </Text>
      <Text style={[iOSUIKit.body, styles.subtitle]}>
        {"Pick one to start your\u00A0countdown"}
      </Text>
      <ScrollView
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {rows.map((row, rowIndex) => (
          <Animated.View
            key={rowIndex}
            entering={FadeIn.delay(
              STAGGER_BASE + rowIndex * STAGGER_STEP,
            ).duration(100)}
            style={styles.row}
          >
            {row.map((item) => (
              <Pressable
                key={item.id}
                style={({ pressed }) => [
                  styles.posterWrapper,
                  { opacity: pressed ? 0.8 : 1 },
                ]}
                onPress={() => navigateToPick(item)}
              >
                {item.imageUri ? (
                  <Image
                    style={styles.poster}
                    source={{ uri: item.imageUri }}
                    contentFit="cover"
                  />
                ) : (
                  <View style={[styles.poster, styles.posterFallback]}>
                    <Text style={styles.posterFallbackText} numberOfLines={3}>
                      {item.title}
                    </Text>
                  </View>
                )}
              </Pressable>
            ))}
          </Animated.View>
        ))}
      </ScrollView>
      {/* <View style={[styles.skipArea, { paddingBottom: bottom + 16 }]}> */}
      <View style={[styles.skipArea, { paddingVertical: bottom }]}>
        <Pressable
          onPress={() => navigateToPick(null)}
          hitSlop={12}
          style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
        >
          <Text style={[iOSUIKit.body, styles.skipText]}>Skip</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: "center",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "white",
    textAlign: "center",
    paddingHorizontal: SPACING,
    marginTop: 8,
  },
  subtitle: {
    color: colors.secondaryLabel,
    textAlign: "center",
    paddingHorizontal: SPACING,
    marginTop: 8,
    marginBottom: 16,
  },
  grid: {
    paddingHorizontal: SPACING,
    paddingBottom: 8,
  },
  row: {
    flexDirection: "row",
    gap: GAP,
    marginBottom: GAP,
  },
  posterWrapper: {
    flex: 1,
  },
  poster: {
    width: "100%",
    aspectRatio: 2 / 3,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.separator,
  },
  posterFallback: {
    backgroundColor: colors.systemGray5,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  posterFallbackText: {
    color: colors.secondaryLabel,
    fontSize: 12,
    textAlign: "center",
  },
  skipArea: {
    alignItems: "center",
    // paddingTop: 12,
    paddingHorizontal: SPACING,
  },
  skipText: {
    color: colors.secondaryLabel,
  },
});
