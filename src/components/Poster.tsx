import React, { useContext } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { Image, Pressable, Text, View } from "react-native";
import { iOSColors, iOSUIKit } from "react-native-typography";
import { reusableStyles } from "../helpers/styles";
import { IGDB, Navigation, TMDB, Trakt } from "../../types";
import PosterButton from "./PosterButton";
import ThemeContext from "../ThemeContext";
import UserContext from "../UserContext";

interface Props {
  navigation: StackNavigationProp<Navigation.FindStackParamList, "Find"> | StackNavigationProp<Navigation.FindStackParamList, "Details">,
  mediaType: "game" | "movie" | "tv",
  data: TMDB.Movie.Movie | Trakt.ShowPremiere | Trakt.ShowSearch | IGDB.Game.Game
  inCountdown: boolean;
}

function MoviePoster({ data, inCountdown }: { data: TMDB.Movie.Movie, inCountdown: boolean }) {
  const uid = useContext(UserContext)
  return (
    <>
      <PosterButton data={data} inCountdown={inCountdown} uid={uid} mediaType={"movie"} />
      {data.poster_path
        ? <Image
          style={reusableStyles.itemRight}
          source={{ uri: `https://image.tmdb.org/t/p/w300${data.poster_path}` }}
        />
        : <TextPoster text={data.title} />
      }
    </>
  )
}

function TVPoster({ data, inCountdown }: { data: Trakt.ShowPremiere | Trakt.ShowSearch, inCountdown: boolean}) {
  const uid = useContext(UserContext)
  return (
    <>
      <PosterButton data={data} inCountdown={inCountdown} uid={uid} mediaType={"tv"} />
      {data.show.tmdbData?.poster_path
        ? <Image
          style={reusableStyles.itemRight}
          source={{ uri: `https://image.tmdb.org/t/p/w300${data.show.tmdbData.poster_path}` }}
        />
        : <TextPoster text={data.show.title} />
      }
    </>
  )
}

function GamePoster({ data }: { data: IGDB.Game.Game }) {
  return (
    data.cover?.url
      ? <Image
        style={reusableStyles.itemRight}
        // source={{ uri: `https:${(data as IGDB.ReleaseDate.ReleaseDate)?.game?.cover?.url.replace("thumb", "cover_big_2x")}` }}
        source={{ uri: `https:${data.cover?.url.replace("thumb", "cover_big_2x")}` }}
      />
      : <TextPoster text={data.name} />
  )
}

function TextPoster({ text }: { text: string }) {
  const colorScheme = useContext(ThemeContext)
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

function Poster({ navigation, mediaType, data, inCountdown }: Props) {
  return (
    <Pressable onPress={() => navigation.navigate('Details', { type: mediaType, data: data })}>
      {mediaType === "movie" &&
        <MoviePoster
          data={data as TMDB.Movie.Movie}
          inCountdown={inCountdown}
        />
      }
      {mediaType === "tv" &&
        <TVPoster
          data={data as Trakt.ShowPremiere | Trakt.ShowSearch}
          inCountdown={inCountdown}
        />
      }
      {mediaType === "game" &&
        <GamePoster
          data={data as IGDB.Game.Game}
        />
      }
    </Pressable>
  )
}

export default Poster;
