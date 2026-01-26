import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { Image } from "expo-image";
import { Color } from "expo-router";
import { usePostHog } from "posthog-react-native";
import { Pressable, StyleSheet, View } from "react-native";
import RevenueCatUI from "react-native-purchases-ui";

import { useProOfferings } from "@/api/getProOfferings";
import { handleMovieToggle, removeSub } from "@/helpers/helpers";
import {
  useAuthStore,
  useSubscriptionStore,
  useInterfaceStore,
} from "@/stores";
import { Game, ReleaseDate } from "@/types";

interface Props {
  movieId?: string;
  game?: Game & { release_dates: ReleaseDate[] };
}

function PosterButton({ movieId, game }: Props) {
  const { user, isPro } = useAuthStore();
  const { movieSubs, gameSubs, hasReachedLimit } = useSubscriptionStore();
  const { bottomSheetModalRef } = useInterfaceStore();
  const { data: pro } = useProOfferings();
  const posthog = usePostHog();

  const isMovieSub = () =>
    movieId && movieSubs.some((sub) => sub.documentID === movieId.toString());

  const isGameSub = () =>
    game && gameSubs.some((releaseDate) => releaseDate.game.id === game.id);

  async function toggleMovieSub() {
    return handleMovieToggle({
      movieId: movieId!,
      userId: user!.uid,
      isCurrentlySubbed: isMovieSub(),
      isPro,
      hasReachedLimit,
      proOffering: pro,
    });
  }

  async function toggleGameSub() {
    const gameId = gameSubs.find(
      (releaseDate) => releaseDate.game.id === game!.id,
    )?.documentID;

    // If trying to add and limit reached, show Pro modal
    if (!isGameSub() && hasReachedLimit(isPro)) {
      await RevenueCatUI.presentPaywall({ offering: pro });
      posthog.capture("poster_button:paywall_view", { type: "pro" });
      return;
    }

    return isGameSub()
      ? removeSub("gameReleases", gameId, user!.uid)
      : bottomSheetModalRef.current?.present(game);
  }

  const isSubscribed = isMovieSub() || isGameSub();

  const icon = (
    <Image
      transition={{ effect: "sf:replace" }}
      source={isSubscribed ? "sf:checkmark" : "sf:plus"}
      style={{ fontSize: 24 }}
      tintColor={Color.ios.label}
    />
  );

  const Container = isLiquidGlassAvailable() ? GlassView : View;
  const containerStyle = isLiquidGlassAvailable()
    ? styles.container
    : styles.fallbackContainer;

  return (
    <Pressable
      onPress={movieId ? toggleMovieSub : toggleGameSub}
      style={styles.button}
    >
      <Container
        {...(isLiquidGlassAvailable() && { glassEffectStyle: "regular" })}
        style={containerStyle}
      >
        {icon}
      </Container>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    zIndex: 1,
    bottom: 4,
    right: 4,
  },
  container: {
    height: 36,
    width: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  fallbackContainer: {
    height: 36,
    width: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Color.ios.systemGray5,
    borderColor: Color.ios.separator,
    borderWidth: StyleSheet.hairlineWidth,
  },
});

export default PosterButton;
