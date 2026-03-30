import { Image } from "expo-image";
import { useSegments } from "expo-router";
import { usePostHog } from "posthog-react-native";
import { ImageStyle, Pressable, StyleProp, ViewStyle } from "react-native";
import { Movie, PosterSize, Recommendation } from "tmdb-ts";

import { useLimitHitOffering, useProOfferings } from "@/api/getProOfferings";
import { handleMovieToggle } from "@/helpers/helpers";
import { useAuthenticatedUser } from "@/hooks/useAuthenticatedUser";
import { useAuthStore } from "@/stores/auth";
import { useSubscriptionStore } from "@/stores/subscription";
import { colors } from "@/theme/colors";
import { onShare } from "@/utils/share";

import { ContextMenuLink } from "../ContextMenuLink";
import PosterButton from "../PosterButton";

import { PosterFallback } from "./PosterFallback";

export function MoviePoster({
  movie,
  posterPath,
  style,
  buttonStyle,
}: {
  movie: Movie | Recommendation;
  posterPath: string;
  style?: StyleProp<ImageStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
}) {
  const segments = useSegments();
  // segment is undefined from MovieLayout, research why
  const stack = (segments[1] as "(find)" | "(countdown)" | "(search)") ?? "(find)";

  const isPro = useAuthStore((s) => s.isPro);
  const user = useAuthenticatedUser();
  const posthog = usePostHog();

  const movieSubs = useSubscriptionStore((s) => s.movieSubs);
  const hasReachedLimit = useSubscriptionStore((s) => s.hasReachedLimit);
  const { data: pro } = useProOfferings();
  const { data: limitHit } = useLimitHitOffering();

  const isMovieSub = movieSubs.some(
    (sub) => sub.documentID === movie.id.toString(),
  );

  return (
    <ContextMenuLink
      href={`/(tabs)/${stack}/movie/${movie?.id}`}
      handleCountdownToggle={{
        action: () =>
          handleMovieToggle({
            movieId: movie.id.toString(),
            movieName: movie.title,
            userId: user.uid,
            isCurrentlySubbed: isMovieSub,
            isPro,
            hasReachedLimit,
            proOffering: limitHit ?? pro,
            onLimitPaywallView: limitHit
              ? () => posthog.capture("limit:paywall_view")
              : undefined,
            onLimitPaywallDismiss: limitHit
              ? () => posthog.capture("limit:paywall_dismiss")
              : undefined,
          }),
        buttonText: isMovieSub ? "Remove from Countdown" : "Add to Countdown",
      }}
      handleShareSelect={() => onShare(`movie/${movie.id}`, "poster")}
    >
      <Pressable
        style={buttonStyle}
        // https://github.com/dominicstop/react-native-ios-context-menu/issues/9#issuecomment-1047058781
        // These are still needed even with expo-router Link
        delayLongPress={100} // Leave room for a user to be able to click
        onLongPress={() => {}} // A callback that does nothing
      >
        {movie && (
          <PosterButton movieId={movie.id.toString()} movieName={movie.title} />
        )}
        {posterPath ? (
          <Image
            style={[
              {
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.separator,
              },
              style,
            ]}
            source={{
              uri: `https://image.tmdb.org/t/p/${PosterSize.W300}${posterPath}`,
            }}
          />
        ) : (
          <PosterFallback text={movie.title} style={style} />
        )}
      </Pressable>
    </ContextMenuLink>
  );
}
