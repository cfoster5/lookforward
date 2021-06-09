import React, { useContext } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { Image, Pressable, Text, View } from "react-native";
import { iOSColors, iOSUIKit } from "react-native-typography";
import { reusableStyles } from "../helpers/styles";
import { IGDB, Navigation, TMDB, Trakt } from "../../types";
import PosterButton from "./PosterButton";
import ThemeContext from "../contexts/ThemeContext";
import { MovieSubContext, ShowSubContext } from "../contexts/SubContexts";

interface Props {
  navigation: StackNavigationProp<Navigation.FindStackParamList, "Find"> | StackNavigationProp<Navigation.FindStackParamList, "Details">,
  data: TMDB.Movie.Movie | Trakt.ShowPremiere | Trakt.ShowSearch | IGDB.Game.Game
  categoryIndex: number;
}

function Poster({ navigation, data, categoryIndex }: Props) {
  const movieSubs = useContext(MovieSubContext);
  const showSubs = useContext(ShowSubContext);
  const colorScheme = useContext(ThemeContext);

  let mediaType: "movie" | "tv" | "game" = "movie";
  if (categoryIndex === 0) { mediaType = "movie" };
  if (categoryIndex === 1) { mediaType = "tv" };
  if (categoryIndex === 2) { mediaType = "game" };

  let inCountdown = false;
  if (categoryIndex === 0) { inCountdown = movieSubs.some((movie: TMDB.Movie.Movie) => movie.id === (data as TMDB.Movie.Movie).id) };
  if (categoryIndex === 1) { inCountdown = showSubs.some((premiere: Trakt.ShowPremiere) => premiere.show.ids.trakt === (data as Trakt.ShowPremiere).show.ids.trakt) };

  function MoviePoster() {
    return (
      <>
        <PosterButton data={data as TMDB.Movie.Movie} inCountdown={inCountdown} mediaType={"movie"} />
        {(data as TMDB.Movie.Movie).poster_path
          ? <Image
            style={reusableStyles.itemRight}
            source={{ uri: `https://image.tmdb.org/t/p/w300${(data as TMDB.Movie.Movie).poster_path}` }}
          />
          : <TextPoster text={(data as TMDB.Movie.Movie).title} />
        }
      </>
    )
  }

  function TVPoster() {
    return (
      <>
        <PosterButton data={data as Trakt.ShowPremiere | Trakt.ShowSearch} inCountdown={inCountdown} mediaType={"tv"} />
        {(data as Trakt.ShowPremiere | Trakt.ShowSearch).show.tmdbData?.poster_path
          ? <Image
            style={reusableStyles.itemRight}
            source={{ uri: `https://image.tmdb.org/t/p/w300${(data as Trakt.ShowPremiere | Trakt.ShowSearch).show.tmdbData.poster_path}` }}
          />
          : <TextPoster text={(data as Trakt.ShowPremiere | Trakt.ShowSearch).show.title} />
        }
      </>
    )
  }

  function GamePoster() {
    return (
      (data as IGDB.Game.Game).cover?.url
        ? <Image
          style={reusableStyles.itemRight}
          // source={{ uri: `https:${(data as IGDB.ReleaseDate.ReleaseDate)?.game?.cover?.url.replace("thumb", "cover_big_2x")}` }}
          source={{ uri: `https:${(data as IGDB.Game.Game).cover?.url.replace("thumb", "cover_big_2x")}` }}
        />
        : <TextPoster text={(data as IGDB.Game.Game).name} />
    )
  }

  function TextPoster({ text }: { text: string }) {
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

  return (
    <Pressable onPress={() => navigation.navigate('Details', { type: mediaType, data: data })}>
      {mediaType === "movie" &&
        <MoviePoster />
      }
      {mediaType === "tv" &&
        <TVPoster />
      }
      {mediaType === "game" &&
        <GamePoster />
      }
    </Pressable>
  )
}

export default Poster;
