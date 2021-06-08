import React, { useContext } from "react";
import { Dimensions, Image, Linking, Pressable, Text, View } from "react-native";
import { iOSUIKit } from "react-native-typography";
import { IGDB, TMDB } from "../../types";
import ThemeContext from "../ThemeContext";

function Trailer({ video, index }: { video: TMDB.Movie.VideoResult | IGDB.Game.Video, index: number}) {
  const colorScheme = useContext(ThemeContext)
  return (
    // <Pressable key={index} onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${video.key}`)}>
    <Pressable key={index} onPress={() => Linking.openURL((video as TMDB.Movie.VideoResult).key ? `https://www.youtube.com/watch?v=${(video as TMDB.Movie.VideoResult).key}`: `https://www.youtube.com/watch?v=${(video as IGDB.Game.Video).video_id}`)}>
      <View style={{ flex: 1, flexDirection: 'row', marginTop: 16, alignItems: "center" }}>
        <Image
          style={{ width: (Dimensions.get("window").width / 2 - 16), height: (180 / 320) * ((Dimensions.get("window").width / 2) - 16), resizeMode: "cover", borderRadius: 8, marginRight: 8, borderWidth: 1,
          borderColor: colorScheme === "dark" ? "#1f1f1f" : "#e0e0e0" }}
          source={{ uri: (video as TMDB.Movie.VideoResult).key ? `https://img.youtube.com/vi/${(video as TMDB.Movie.VideoResult).key}/mqdefault.jpg` : `https://img.youtube.com/vi/${(video as IGDB.Game.Video).video_id}/mqdefault.jpg` }}
        />
        <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject, width: (Dimensions.get("window").width / 2) - 40 } : { ...iOSUIKit.bodyObject, width: (Dimensions.get("window").width / 2) - 40 }}>{video.name}</Text>
      </View>
    </Pressable>
  )
}

export default Trailer;