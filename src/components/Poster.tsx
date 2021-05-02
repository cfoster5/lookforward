import React from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { ColorSchemeName, Image, Pressable, Text, View } from "react-native";
import { iOSColors, iOSUIKit } from "react-native-typography";
import { reusableStyles } from "../helpers/styles";
import { IGDB, Navigation, TMDB, Trakt } from "../../types";
import PosterButton from "./PosterButton";

interface Props {
  navigation: StackNavigationProp<Navigation.FindStackParamList, "Find"> | StackNavigationProp<Navigation.FindStackParamList, "Details">,
  mediaType: "game" | "movie" | "tv",
  // data: TMDB.Movie.Movie | IGDB.ReleaseDate.ReleaseDate
  data: TMDB.Movie.Movie | Trakt.ShowPremiere | IGDB.Game.Game
  inCountdown: boolean;
  uid: string;
  colorScheme: ColorSchemeName
}

function MoviePoster({ data, inCountdown, uid, colorScheme }: { data: TMDB.Movie.Movie, inCountdown: boolean, uid: string, colorScheme: ColorSchemeName }) {
  return (
    <>
      <PosterButton data={data} inCountdown={inCountdown} uid={uid} />
      {data.poster_path
        ? <Image
          style={reusableStyles.itemRight}
          source={{ uri: `https://image.tmdb.org/t/p/w300${data.poster_path}` }}
        />
        : <TextPoster text={data.title} colorScheme={colorScheme} />
      }
    </>
  )
}
function TVPoster({ data, colorScheme }: { data: Trakt.ShowPremiere, colorScheme: ColorSchemeName }) {
  return (
    data.show.tmdbData?.poster_path
      ? <Image
        style={reusableStyles.itemRight}
        source={{ uri: `https://image.tmdb.org/t/p/w300${data.show.tmdbData.poster_path}` }}
      />
      : <TextPoster text={data.show.title} colorScheme={colorScheme} />

  )
}

function GamePoster({ data, colorScheme }: { data: IGDB.Game.Game, colorScheme: ColorSchemeName }) {
  return (
    data.cover?.url
      ? <Image
        style={reusableStyles.itemRight}
        // source={{ uri: `https:${(data as IGDB.ReleaseDate.ReleaseDate)?.game?.cover?.url.replace("thumb", "cover_big_2x")}` }}
        source={{ uri: `https:${data.cover?.url.replace("thumb", "cover_big_2x")}` }}
      />
      : <TextPoster text={data.name} colorScheme={colorScheme} />
  )
}

function TextPoster({ text, colorScheme }: { text: string, colorScheme: ColorSchemeName }) {
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

function Poster({ navigation, mediaType, data, inCountdown, uid, colorScheme }: Props) {
  return (
    <Pressable onPress={() => navigation.navigate('Details', { type: mediaType, data: data, uid: uid })}>
      {mediaType === "movie" &&
        <MoviePoster data={data as TMDB.Movie.Movie} inCountdown={inCountdown} uid={uid} colorScheme={colorScheme} />
      }
      {mediaType === "tv" &&
        <TVPoster data={data as Trakt.ShowPremiere} colorScheme={colorScheme} />
      }
      {mediaType === "game" &&
        <GamePoster data={data as IGDB.Game.Game} colorScheme={colorScheme} />
      }
    </Pressable>
  )
}

export default Poster;
