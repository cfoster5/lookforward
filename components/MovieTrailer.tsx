import React from "react";
import { Appearance, Dimensions, Image, Linking, Pressable, Text, View } from "react-native";
import { iOSUIKit } from "react-native-typography";
import { TMDB } from "../types";

function MovieTrailer({ video, index }: { video: TMDB.Movie.VideoResult, index: number }) {
  const colorScheme = Appearance.getColorScheme();
  return (
    <Pressable key={index} onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${video.key}`)}>
      <View style={{ flex: 1, flexDirection: 'row', marginBottom: 16, alignItems: "center" }}>
        <Image
          style={{ width: (Dimensions.get("window").width / 2 - 16), height: (180 / 320) * ((Dimensions.get("window").width / 2) - 16), resizeMode: "stretch", borderRadius: 8, marginRight: 8 }}
          source={{ uri: `https://img.youtube.com/vi/${video.key}/mqdefault.jpg` }}
        />
        <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject, width: (Dimensions.get("window").width / 2) - 40 } : { ...iOSUIKit.bodyObject, width: (Dimensions.get("window").width / 2) - 40 }}>{video.name}</Text>
      </View>
    </Pressable>
  )
}

export default MovieTrailer;