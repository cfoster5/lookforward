import * as Colors from "@bacons/apple-colors";
import { Image } from "expo-image";
import { useSegments } from "expo-router";
import { ImageStyle, Pressable, StyleProp, ViewStyle } from "react-native";
import { Movie, PosterSizes, Recommendation } from "tmdb-ts";

import { useProOfferings } from "@/api/getProOfferings";
import { handleMovieToggle } from "@/helpers/helpers";
import { useAuthStore, useSubscriptionStore } from "@/stores";
import { onShare } from "@/utils/share";

import { ContextMenuLink } from "../ContextMenuLink";
import PosterButton from "../PosterButton";

import { TextPoster } from "./TextPoster";

export function MoviePoster({
  movie,
  posterPath,
  style,
  buttonStyle,
}: {
  movie?: Movie | Recommendation;
  posterPath: string;
  style?: StyleProp<ImageStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
}) {
  const segments = useSegments();
  // segment is undefined from MovieLayout, research why
  const stack = (segments[1] as "(find)" | "(countdown)") ?? "(find)";

  const { user, isPro } = useAuthStore();
  const { movieSubs, hasReachedLimit } = useSubscriptionStore();
  const { data: pro } = useProOfferings();

  const isMovieSub = () =>
    movie!.id &&
    movieSubs.some((sub) => sub.documentID === movie!.id.toString());

  return (
    <ContextMenuLink
      href={`/(tabs)/${stack}/movie/${movie?.id}`}
      handleCountdownToggle={{
        action: () =>
          handleMovieToggle({
            movieId: movie!.id.toString(),
            userId: user!.uid,
            isCurrentlySubbed: isMovieSub(),
            isPro,
            hasReachedLimit,
            proOffering: pro,
          }),
        buttonText: isMovieSub() ? "Remove from Countdown" : "Add to Countdown",
      }}
      handleShareSelect={() => onShare(`movie/${movie!.id}`, "poster")}
    >
      <Pressable
        style={buttonStyle}
        // https://github.com/dominicstop/react-native-ios-context-menu/issues/9#issuecomment-1047058781
        // These are still needed even with expo-router Link
        delayLongPress={100} // Leave room for a user to be able to click
        onLongPress={() => {}} // A callback that does nothing
      >
        {movie && <PosterButton movieId={movie.id.toString()} />}
        {posterPath ? (
          <Image
            style={[
              {
                borderRadius: 12,
                borderWidth: 1,
                borderColor: Colors.separator,
              },
              style,
            ]}
            source={{
              uri: `https://image.tmdb.org/t/p/${PosterSizes.W300}${posterPath}`,
            }}
          />
        ) : (
          <TextPoster text={movie.title} style={style} />
        )}
      </Pressable>
    </ContextMenuLink>
  );
}
