import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { Appearance, Image, Pressable, Text, View } from "react-native";
import { iOSColors, iOSUIKit } from "react-native-typography";
import { reusableStyles } from "../helpers/styles";
import { IGDB, Navigation, TMDB } from "../../types";
import PosterButton from "./PosterButton";

interface Props {
  navigation: StackNavigationProp<Navigation.HomeStackParamList, "Find"> | StackNavigationProp<Navigation.HomeStackParamList, "Details">,
  mediaType: "game" | "movie",
  // data: TMDB.Movie.Movie | IGDB.ReleaseDate.ReleaseDate
  data: TMDB.Movie.Movie | IGDB.Game.Game
  inCountdown: boolean;
  uid: string;
}

// const colorScheme = Appearance.getColorScheme();
const colorScheme = "dark"

function MediaItem({ navigation, mediaType, data, inCountdown, uid }: Props) {
  return (
    <Pressable onPress={() => navigation.push('Details', { type: mediaType, data: data })}>
      <PosterButton mediaType={mediaType} data={data} inCountdown={inCountdown} uid={uid} />
      {mediaType === "movie" && (data as TMDB.Movie.Movie).poster_path &&
        <Image
          style={reusableStyles.itemRight}
          source={{ uri: `https://image.tmdb.org/t/p/w300${(data as TMDB.Movie.Movie).poster_path}` }}
        />
      }
      {mediaType === "movie" && !(data as TMDB.Movie.Movie).poster_path &&
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
            {(data as TMDB.Movie.Movie).title}
          </Text>
        </View>
      }
      {/* {mediaType === "game" && (data as IGDB.ReleaseDate.ReleaseDate)?.game?.cover?.url && */}
      {mediaType === "game" && (data as IGDB.Game.Game).cover?.url &&
        <Image
          style={reusableStyles.itemRight}
          // source={{ uri: `https:${(data as IGDB.ReleaseDate.ReleaseDate)?.game?.cover?.url.replace("thumb", "cover_big_2x")}` }}
          source={{ uri: `https:${(data as IGDB.Game.Game).cover?.url.replace("thumb", "cover_big_2x")}` }}
        />
      }
      {/* {mediaType === "game" && !(data as IGDB.ReleaseDate.ReleaseDate)?.game?.cover?.url && */}
      {mediaType === "game" && !(data as IGDB.Game.Game).cover?.url &&
        <View
          style={{
            ...reusableStyles.itemRight,
            borderWidth: 1,
            borderColor: colorScheme === "dark" ? "#1f1f1f" : "#e0e0e0",
            flexDirection: 'row',
            alignItems: "center",
            justifyContent: 'center'
          }}
        >
          <Text style={colorScheme === "dark" ? { ...iOSUIKit.title3EmphasizedWhiteObject, textAlign: "center" } : { ...iOSUIKit.title3EmphasizedObject, color: iOSColors.gray, textAlign: "center" }}>
            {/* {(data as IGDB.ReleaseDate.ReleaseDate).game.name} */}
            {(data as IGDB.Game.Game).name}
          </Text>
        </View>
      }
    </Pressable>
  )
}

export default MediaItem;
