import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Appearance, Image, Pressable } from "react-native";
import { reusableStyles } from "../styles";
import { Navigation, release, TMDB } from "../types";

interface Props {
  navigation: StackNavigationProp<Navigation.HomeStackParamList, "Find"> | StackNavigationProp<Navigation.HomeStackParamList, "Details">,
  mediaType: "game" | "movie",
  index: number,
  data: TMDB.Movie.Movie | release
}

function MediaItem({ navigation, mediaType, index, data }: Props) {
  return (
    <Pressable onPress={() => navigation.push('Details', { type: mediaType, data: data })}>
      {mediaType === "movie" &&
        <Image
          style={(index % 2) ? reusableStyles.itemRight : reusableStyles.itemLeft}
          source={{ uri: (data as TMDB.Movie.Movie).poster_path ? `https://image.tmdb.org/t/p/w300${(data as TMDB.Movie.Movie).poster_path}` : `https://via.placeholder.com/500x750?text=${(data as TMDB.Movie.Movie).title}` }}
        />
      }
      {mediaType === "game" &&
        <Image
          style={(index % 2) ? reusableStyles.itemRight : reusableStyles.itemLeft}
          source={{ uri: `https:${(data as release)?.game?.cover?.url.replace("thumb", "cover_big_2x")}` }}
        />
      }
    </Pressable>
  )
}

export default MediaItem;