import React, { useContext } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { Pressable, Text, View } from "react-native";
import { iOSColors, iOSUIKit } from "react-native-typography";
import { reusableStyles } from "../helpers/styles";
import { IGDB } from "../interfaces/igdb";
import PosterButton from "./PosterButton";
import ThemeContext from "../contexts/ThemeContext";
import { GameSubContext, MovieSubContext } from "../contexts/SubContexts";
import FastImage from "react-native-fast-image";
import moment from "moment";
import { TMDB } from "../interfaces/tmdb";
import { Navigation } from "../interfaces/navigation";

function MoviePoster({ item }: { item: TMDB.Movie.Movie }) {
  const movieSubs = useContext(MovieSubContext);
  let inCountdown = false;
  inCountdown = movieSubs.some((movie: TMDB.Movie.Movie) => movie.id === item.id)
  return (
    <>
      {moment(item.release_date) >= moment() &&
        <PosterButton data={item} inCountdown={inCountdown} mediaType={"movie"} />
      }
      {item.poster_path
        ? <FastImage
          style={{ ...reusableStyles.itemRight }}
          source={{ uri: `https://image.tmdb.org/t/p/w300${item.poster_path}` }}
        />
        : <TextPoster text={item.title} upcomingRelease={moment(item.release_date) >= moment()} />
      }
    </>
  )
}

function GamePoster({ item }: { item: IGDB.Game.Game }) {
  const gameSubs = useContext(GameSubContext);
  let inCountdown = false;
  inCountdown = gameSubs.find((releaseDate: IGDB.ReleaseDate.ReleaseDate) => releaseDate.game.id === item.id)?.documentID;
  let hasUpcomingRelease = item.release_dates.filter(releaseDate => moment(releaseDate.date) >= moment()).length === 0;
  return (
    <>
      {hasUpcomingRelease &&
        <PosterButton data={item} inCountdown={inCountdown} mediaType={"game"} />
      }
      {item.cover?.url
        ? <FastImage
          style={{...reusableStyles.gamePoster, height: (item.cover.height / item.cover.width) * reusableStyles.gamePoster.width}}
          // source={{ uri: `https:${(data as IGDB.ReleaseDate.ReleaseDate)?.game?.cover?.url.replace("thumb", "cover_big_2x")}` }}
          source={{ uri: `https:${item.cover?.url.replace("thumb", "cover_big_2x")}` }}
        />
        : <TextPoster text={item.name} upcomingRelease={hasUpcomingRelease} />
      }
    </>
  )
}

function TextPoster({ text, upcomingRelease }: { text: string, upcomingRelease: boolean }) {
  const colorScheme = useContext(ThemeContext);
  return (
    <View
      style={{
        ...reusableStyles.itemRight,
        // borderWidth: 1,
        borderColor: colorScheme === "dark" ? "#1f1f1f" : "#e0e0e0",
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'center'
      }}
    >
      <Text style={colorScheme === "dark" ? { ...iOSUIKit.title3EmphasizedWhiteObject, textAlign: "center" } : { ...iOSUIKit.title3EmphasizedObject, color: iOSColors.gray, textAlign: "center" }}>
        {text}
      </Text>
    </View>
  )
}

interface Props {
  navigation: StackNavigationProp<Navigation.FindStackParamList, "Find"> | StackNavigationProp<Navigation.FindStackParamList, "Details">,
  data: TMDB.Movie.Movie | IGDB.Game.Game
  categoryIndex: number;
}

function Poster({ navigation, data, categoryIndex }: Props) {
  let mediaType: "movie" | "game" = "movie";
  if (categoryIndex === 0) { mediaType = "movie" };
  if (categoryIndex === 1) { mediaType = "game" };

  return (
    <Pressable onPress={() => navigation.push('Details', { type: mediaType, data: data })}>
      {mediaType === "movie" &&
        <MoviePoster item={data as TMDB.Movie.Movie} />
      }
      {mediaType === "game" &&
        <GamePoster item={data as IGDB.Game.Game} />
      }
    </Pressable>
  )
}

export default Poster;
