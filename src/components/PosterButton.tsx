import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { Image } from "expo-image";
import { usePostHog } from "posthog-react-native";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { CustomVariableValue, PAYWALL_RESULT } from "react-native-purchases-ui";

import { useLimitHitOffering, useProOfferings } from "@/api/getProOfferings";
import { handleMovieToggle, removeSub } from "@/helpers/helpers";
import { useAuthenticatedUser } from "@/hooks/useAuthenticatedUser";
import { useAuthStore } from "@/stores/auth";
import { useInterfaceStore } from "@/stores/interface";
import { useSubscriptionStore } from "@/stores/subscription";
import { colors } from "@/theme/colors";
import type { Games, ReleaseDate } from "@/types/igdb";
import { presentPaywallWithRestoreAlert } from "@/utils/paywall";

import { IconSymbol } from "./IconSymbol";

interface Props {
  movieId?: string;
  movieName?: string;
  game?: Games & { release_dates: ReleaseDate[] };
}

function PosterButton({ movieId, movieName, game }: Props) {
  const user = useAuthenticatedUser();
  const isPro = useAuthStore((s) => s.isPro);
  const { movieSubs, gameSubs, hasReachedLimit } = useSubscriptionStore();
  const { bottomSheetModalRef } = useInterfaceStore();
  const { data: pro } = useProOfferings();
  const { data: limitHit } = useLimitHitOffering();
  const posthog = usePostHog();

  const isMovieSub = () =>
    movieId && movieSubs.some((sub) => sub.documentID === movieId.toString());

  const isGameSub = () =>
    game && gameSubs.some((releaseDate) => releaseDate.game.id === game.id);

  async function toggleMovieSub() {
    if (!movieId) return;

    return handleMovieToggle({
      movieId,
      movieName: movieName ?? "",
      userId: user.uid,
      isCurrentlySubbed: isMovieSub(),
      isPro,
      hasReachedLimit,
      proOffering: limitHit ?? pro,
      onLimitPaywallView: limitHit
        ? () => posthog.capture("limit:paywall_view")
        : undefined,
      onLimitPaywallDismiss: limitHit
        ? () => posthog.capture("limit:paywall_dismiss")
        : undefined,
    });
  }

  async function toggleGameSub() {
    if (!game) return;

    const gameId = gameSubs.find(
      (releaseDate) => releaseDate.game.id === game.id,
    )?.documentID;

    // If trying to add and limit reached, show Pro modal
    if (!isGameSub() && hasReachedLimit(isPro)) {
      if (limitHit) {
        posthog.capture("limit:paywall_view");
      } else {
        posthog.capture("poster_button:paywall_view", { type: "pro" });
      }
      const result = await presentPaywallWithRestoreAlert({
        offering: limitHit ?? pro,
        customVariables: {
          item_name: CustomVariableValue.string(game.name),
        },
      });
      if (limitHit && result === PAYWALL_RESULT.CANCELLED) {
        posthog.capture("limit:paywall_dismiss");
      }
      return;
    }

    return isGameSub()
      ? removeSub("gameReleases", gameId, user.uid)
      : bottomSheetModalRef.current?.present(game);
  }

  const isSubscribed = isMovieSub() || isGameSub();

  const icon =
    Platform.OS === "ios" ? (
      <Image
        transition={{ effect: "sf:replace" }}
        source={isSubscribed ? "sf:checkmark" : "sf:plus"}
        style={{ fontSize: 24 }}
        tintColor={colors.label as string}
      />
    ) : (
      <IconSymbol
        name={isSubscribed ? "checkmark" : "plus"}
        size={24}
        color={colors.label as string}
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
    backgroundColor: colors.systemGray5,
    borderColor: colors.separator,
    borderWidth: StyleSheet.hairlineWidth,
  },
});

export default PosterButton;
