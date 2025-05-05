import { Image } from "expo-image";
import {
  ImageStyle,
  PlatformColor,
  Pressable,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Movie, PosterSizes, Recommendation } from "tmdb-ts";

import { ContextMenu } from "@/screens/Search/components/SearchBottomSheet/ContextMenu";
import {
  addCountdownItem,
  removeCountdownItem,
} from "@/screens/Search/utils/firestore";
import { useStore } from "@/stores/store";
import { onShare } from "@/utils/share";

import PosterButton from "../PosterButton";

import { TextPoster } from "./TextPoster";

export function MoviePoster({
  pressHandler,
  movie,
  posterPath,
  style,
  buttonStyle,
}: {
  pressHandler: () => void;
  movie?: Movie | Recommendation;
  posterPath: string;
  style?: StyleProp<ImageStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
}) {
  const { movieSubs, user } = useStore();

  const isMovieSub = () =>
    movie!.id &&
    movieSubs.some((sub) => sub.documentID === movie!.id.toString());

  return (
    <ContextMenu
      handleCountdownToggle={{
        action: () =>
          isMovieSub()
            ? removeCountdownItem("movies", movie!.id, user)
            : addCountdownItem("movies", movie!.id, user),
        buttonText: isMovieSub() ? "Remove from Countdown" : "Add to Countdown",
      }}
      handleShareSelect={() => onShare(`movie/${movie!.id}`, "poster")}
    >
      <Pressable
        onPress={pressHandler}
        style={buttonStyle}
        // https://github.com/dominicstop/react-native-ios-context-menu/issues/9#issuecomment-1047058781
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
                borderColor: PlatformColor("separator"),
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
    </ContextMenu>
  );
}
