import React, { useContext } from "react";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";
import FastImage, { ImageStyle } from "react-native-fast-image";

import SubContext from "../../contexts/SubContext";
import TabStackContext from "../../contexts/TabStackContext";
import { reusableStyles } from "../../helpers/styles";
import { Movie, Recommendation } from "../../interfaces/tmdb";
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
  const { movieSubs } = useContext(SubContext);
  const inCountdown = movie
    ? movieSubs.some((sub) => sub?.documentID == movie.id.toString())
    : null;
  const { theme } = useContext(TabStackContext);

  return (
    <Pressable onPress={pressHandler} style={buttonStyle}>
      {movie && (
        <PosterButton
          movieId={movie.id.toString()}
          inCountdown={inCountdown as boolean}
        />
      )}
      {posterPath ? (
        <FastImage
          style={[
            {
              borderRadius: 8,
              borderWidth: 1,
              borderColor: theme === "dark" ? "#1f1f1f" : "#e0e0e0",
            },
            style,
          ]}
          source={{
            uri: `https://image.tmdb.org/t/p/w300${posterPath}`,
          }}
        />
      ) : (
        <TextPoster text={movie.title} />
      )}
    </Pressable>
  );
}
