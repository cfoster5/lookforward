import React, { useContext } from "react";
import { Pressable, Text, View } from "react-native";
import FastImage from "react-native-fast-image";
import { iOSColors, iOSUIKit } from "react-native-typography";
import { StackNavigationProp } from "@react-navigation/stack";
import moment from "moment";

import SubContext from "../contexts/SubContext";
import TabStackContext from "../contexts/TabStackContext";
import { reusableStyles } from "../helpers/styles";
import { IGDB } from "../interfaces/igdb";
import { Navigation } from "../interfaces/navigation";
import { TMDB } from "../interfaces/tmdb";
import PosterButton from "./PosterButton";

function MoviePoster({ item }: { item: TMDB.Movie.Movie }) {
  const { movies } = useContext(SubContext);
  let inCountdown = false;
  inCountdown = movies.some((movie: TMDB.Movie.Movie) => movie.id === item.id);
  return (
    <>
      {moment(item.release_date) >= moment() && (
        <PosterButton
          data={item}
          inCountdown={inCountdown}
          mediaType={"movie"}
        />
      )}
      {item.poster_path ? (
        <FastImage
          style={{ ...reusableStyles.itemRight }}
          source={{ uri: `https://image.tmdb.org/t/p/w300${item.poster_path}` }}
        />
      ) : (
        <TextPoster
          text={item.title}
          upcomingRelease={moment(item.release_date) >= moment()}
        />
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
      (releaseDate) => moment(releaseDate.date) >= moment()
    ).length === 0;
  return (
    <>
      {hasUpcomingRelease && (
        <PosterButton
          data={item}
          inCountdown={inCountdown}
          mediaType={"game"}
        />
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
        <TextPoster text={item.name} upcomingRelease={hasUpcomingRelease} />
      )}
    </>
  );
}

export function TextPoster({
  text,
  upcomingRelease,
}: {
  text: string;
  upcomingRelease: boolean;
}) {
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
  navigation:
    | StackNavigationProp<Navigation.FindStackParamList, "Find">
    | StackNavigationProp<Navigation.FindStackParamList, "Details">;
  data: TMDB.Movie.Movie | IGDB.Game.Game;
  categoryIndex: number;
}

function Poster({ navigation, data, categoryIndex }: Props) {
  let mediaType: "movie" | "game" = "movie";
  if (categoryIndex === 0) {
    mediaType = "movie";
  }
  if (categoryIndex === 1) {
    mediaType = "game";
  }

  return (
    <Pressable
      onPress={() =>
        navigation.push("Details", { type: mediaType, data: data })
      }
    >
      {mediaType === "movie" && <MoviePoster item={data as TMDB.Movie.Movie} />}
      {mediaType === "game" && <GamePoster item={data as IGDB.Game.Game} />}
    </Pressable>
  );
}

export default Poster;
