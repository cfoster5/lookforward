import { Image } from "expo-image";
import {
  ImageStyle,
  PlatformColor,
  Pressable,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Movie, PosterSizes, Recommendation } from "tmdb-ts";

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
  return (
    <Pressable onPress={pressHandler} style={buttonStyle}>
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
  );
}
