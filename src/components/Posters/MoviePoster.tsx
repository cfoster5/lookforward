import React, { useContext } from "react";
import FastImage from "react-native-fast-image";

import SubContext from "../../contexts/SubContext";
import { reusableStyles } from "../../helpers/styles";
import { Movie } from "../../interfaces/tmdb";
import PosterButton from "../PosterButton";
import { TextPoster } from "./TextPoster";

export function MoviePoster({ movie, style }: { movie: Movie; style?: any }) {
  const { movieSubs } = useContext(SubContext);
  const inCountdown = movieSubs.some(
    (sub) => sub?.documentID == movie.id.toString()
  );
  return (
    <>
      <PosterButton movie={movie} inCountdown={inCountdown} />
      {movie.poster_path ? (
        <FastImage
          style={{
            ...reusableStyles.itemRight,
            ...style,
          }}
          source={{
            uri: `https://image.tmdb.org/t/p/w300${movie.poster_path}`,
          }}
        />
      ) : (
        <TextPoster text={movie.title} />
      )}
    </>
  );
}
