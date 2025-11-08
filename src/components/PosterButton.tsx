import * as Colors from "@bacons/apple-colors";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { Pressable, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { removeSub, subToMovie } from "@/helpers/helpers";
import {
  useAuthStore,
  useSubscriptionStore,
  useInterfaceStore,
} from "@/stores";
import { Game, ReleaseDate } from "@/types";

import { IconSymbol } from "./IconSymbol";

interface Props {
  movieId?: string;
  game?: Game & { release_dates: ReleaseDate[] };
}

function PosterButton({ movieId, game }: Props) {
  const { user, isPro } = useAuthStore();
  const { movieSubs, gameSubs, hasReachedLimit } = useSubscriptionStore();
  const { bottomSheetModalRef, proModalRef } = useInterfaceStore();

  const isMovieSub = () =>
    movieId && movieSubs.some((sub) => sub.documentID === movieId.toString());

  const isGameSub = () =>
    game && gameSubs.some((releaseDate) => releaseDate.game.id === game.id);

  function toggleMovieSub() {
    // If trying to add and limit reached, show Pro modal
    if (!isMovieSub() && hasReachedLimit(isPro)) {
      proModalRef.current?.present();
      return;
    }

    return isMovieSub()
      ? removeSub("movies", movieId!, user!.uid)
      : subToMovie(movieId!, user!.uid);
  }

  function toggleGameSub() {
    const gameId = gameSubs.find(
      (releaseDate) => releaseDate.game.id === game!.id,
    )?.documentID;

    // If trying to add and limit reached, show Pro modal
    if (!isGameSub() && hasReachedLimit(isPro)) {
      proModalRef.current?.present();
      return;
    }

    return isGameSub()
      ? removeSub("gameReleases", gameId, user!.uid)
      : bottomSheetModalRef.current?.present(game);
  }

  return (
    <Pressable
      onPress={movieId ? () => toggleMovieSub() : () => toggleGameSub()}
      style={{ position: "absolute", zIndex: 1, bottom: 4, right: 4 }}
    >
      {isLiquidGlassAvailable() ? (
        <GlassView
          glassEffectStyle="regular"
          style={{
            height: 36,
            width: 36,
            borderRadius: 18,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Animated.View entering={FadeIn} key={isMovieSub() || isGameSub()}>
            <IconSymbol
              color={Colors.label}
              name={isMovieSub() || isGameSub() ? "checkmark" : "plus"}
            />
          </Animated.View>
        </GlassView>
      ) : (
        <View
          style={{
            height: 36,
            width: 36,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: Colors.separator,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              height: 36,
              width: 36,
              borderRadius: 18,
              backgroundColor: Colors.systemGray5,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Animated.View entering={FadeIn} key={isMovieSub() || isGameSub()}>
              <IconSymbol
                color={Colors.label}
                name={isMovieSub() || isGameSub() ? "checkmark" : "plus"}
              />
            </Animated.View>
          </View>
        </View>
      )}
    </Pressable>
  );
}

export default PosterButton;
