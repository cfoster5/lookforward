import { Image } from "expo-image";
import { ImageStyle, Pressable, StyleProp, ViewStyle } from "react-native";

import { TextPoster } from "./TextPoster";
import { Movie, Recommendation } from "../../interfaces/tmdb";
import { PosterSizes } from "../../interfaces/tmdb/configuration";
import PosterButton from "../PosterButton";

import { Colors } from "@/constants/Colors";

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
  );
}
