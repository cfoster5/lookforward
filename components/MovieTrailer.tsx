import React from "react";
import { Appearance, Dimensions, Image, Linking, Pressable, Text, View } from "react-native";
import { iOSUIKit } from "react-native-typography";
import { TMDB } from "../types";

function MovieTrailer({ video, index }: { video: TMDB.Movie.VideoResult, index: number }) {

  const colorScheme = Appearance.getColorScheme();

  // <Pressable key={i} onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${video.key}`)}>
  // <Pressable key={i} onPress={() => Linking.openURL(`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`)}>
  //   <Text style={iOSUIKit.body}>{video.name}</Text>
  // </Pressable>

  return (
    // <Pressable key={i} onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${video.key}`)}>
    // <Pressable key={i} onPress={() => Linking.openURL(`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`)}>
    //   <Text style={iOSUIKit.body}>{video.name}</Text>
    // </Pressable>

    <Pressable key={index} onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${video.key}`)}>
      <View style={{ flex: 1, flexDirection: 'row', marginTop: 16, alignItems: "center" }}>
        <Image
          // style={{ width: Dimensions.get("window").width / 2, height: (180 / 320) * (Dimensions.get("window").width / 2), resizeMode: "stretch", borderRadius: 8, marginRight: 8 }}
          style={{ width: (Dimensions.get("window").width / 2 - 16), height: (180 / 320) * ((Dimensions.get("window").width / 2) - 16), resizeMode: "stretch", borderRadius: 8, marginRight: 8 }}
          source={{ uri: `https://img.youtube.com/vi/${video.key}/mqdefault.jpg` }}
        />
        {/* <Text style={iOSUIKit.body}>{video.name}</Text> */}
        <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject, width: (Dimensions.get("window").width / 2) - 40 } : { ...iOSUIKit.bodyObject, width: (Dimensions.get("window").width / 2) - 40 }}>{video.name}</Text>
      </View>
    </Pressable>

    // <Pressable onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${video.key}`)}>
    //   <View style={index > 0 ? { marginTop: 16 } : null}>
    //     <Image
    //       style={{ width: Dimensions.get("window").width - 32, height: (180 / 320) * (Dimensions.get("window").width - 32), resizeMode: "stretch", borderRadius: 8, marginRight: 8 }}
    //       source={{ uri: `https://img.youtube.com/vi/${video.key}/maxresdefault.jpg` }}
    //     />
    //     <Text style={iOSUIKit.body}>{video.name}</Text>
    //   </View>
    // </Pressable>
  )
}

export default MovieTrailer;