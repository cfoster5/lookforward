import React, { useContext } from "react";
import { Pressable, Text, View } from "react-native";
import FastImage from "react-native-fast-image";
import { iOSColors, iOSUIKit } from "react-native-typography";
import { StackNavigationProp } from "@react-navigation/stack";
import { DateTime } from "luxon";

import SubContext from "../contexts/SubContext";
import TabStackContext from "../contexts/TabStackContext";
import { reusableStyles } from "../helpers/styles";
import { IGDB } from "../interfaces/igdb";
import { Movie } from "../interfaces/tmdb";
import PosterButton from "./PosterButton";

function MoviePoster({ item, style }: { item: Movie; style?: any }) {
  const { movies } = useContext(SubContext);
  let inCountdown = false;
  inCountdown = movies.some((movie: Movie) => movie.id === item.id);
  return (
    <>
      {/* {DateTime.fromISO(item.release_date) >= DateTime.now() && ( */}
      <PosterButton movie={item} inCountdown={inCountdown} />
      {/* )} */}
      {item.poster_path ? (
        <FastImage
          style={{
            ...reusableStyles.itemRight,
            ...style,
            // opacity:
            //   DateTime.fromISO(item.release_date) >= DateTime.now() ? 1 : 0.6,
          }}
          source={{
            uri: `https://image.tmdb.org/t/p/w300${item.poster_path}`,
          }}
        />
      ) : (
        <TextPoster text={item.title} />
      )}
    </>
  );
}

function GamePoster({ item }: { item: IGDB.Game.Game }) {
  const { games } = useContext(SubContext);
  let inCountdown = false;
  inCountdown = games.find(
    (releaseDate: IGDB.ReleaseDate.ReleaseDate) =>
      releaseDate.game.id === item.id
  )?.documentID;
  let hasUpcomingRelease =
    item.release_dates.filter(
      (releaseDate) => DateTime.fromISO(releaseDate.date) >= DateTime.now()
    ).length === 0;
  return (
    <>
      {hasUpcomingRelease && (
        <PosterButton game={item} inCountdown={inCountdown} />
      )}
      {item.cover?.url ? (
        <FastImage
          style={{
            ...reusableStyles.gamePoster,
            height:
              (item.cover.height / item.cover.width) *
              reusableStyles.gamePoster.width,
          }}
          // source={{ uri: `https:${(data as IGDB.ReleaseDate.ReleaseDate)?.game?.cover?.url.replace("thumb", "cover_big_2x")}` }}
          source={{
            uri: `https:${item.cover?.url.replace("thumb", "cover_big_2x")}`,
          }}
        />
      ) : (
        <TextPoster text={item.name} />
      )}
    </>
  );
}

export function TextPoster({ text, style }: { text: string; style?: any }) {
  const { theme } = useContext(TabStackContext);
  return (
    <View
      style={{
        ...reusableStyles.itemRight,
        // borderWidth: 1,
        borderColor: theme === "dark" ? "#1f1f1f" : "#e0e0e0",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      <Text
        style={
          theme === "dark"
            ? { ...iOSUIKit.title3EmphasizedWhiteObject, textAlign: "center" }
            : {
                ...iOSUIKit.title3EmphasizedObject,
                color: iOSColors.gray,
                textAlign: "center",
              }
        }
      >
        {text}
      </Text>
    </View>
  );
}

interface Props {
  movie?: Movie | TMDB.MovieCredits.Cast | TMDB.MovieCredits.Crew;
  game?: IGDB.Game.Game;
  style?: any;
}

export function NewPoster({ movie, game, style }: Props) {
  return movie ? (
    <MoviePoster item={movie} style={style} />
  ) : (
    <GamePoster item={game} />
  );
}

export default NewPoster;
