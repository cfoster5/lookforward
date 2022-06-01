import React, { useContext } from "react";
import {
  Dimensions,
  Image,
  Linking,
  Pressable,
  Text,
  View,
} from "react-native";
import { iOSColors, iOSUIKit } from "react-native-typography";

import TabStackContext from "../contexts/TabStackContext";
import { IGDB } from "../interfaces/igdb";
import { Video } from "../interfaces/tmdb";
// import { Text } from "./Themed";

function Trailer({ video }: { video: Video | IGDB.Game.Video }) {
  const { theme } = useContext(TabStackContext);
  return (
    // <Pressable key={index} onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${video.key}`)}>
    <Pressable
      onPress={() =>
        Linking.openURL(
          (video as Video).key
            ? `https://www.youtube.com/watch?v=${(video as Video).key}`
            : `https://www.youtube.com/watch?v=${
                (video as IGDB.Game.Video).video_id
              }`
        )
      }
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          marginTop: 16,
          alignItems: "center",
        }}
      >
        <Image
          style={{
            width: Dimensions.get("window").width / 1.5 - 16,
            height: (180 / 320) * (Dimensions.get("window").width / 1.5 - 16),
            resizeMode: "cover",
            borderRadius: 8,
            marginRight: 8,
            borderWidth: 1,
            borderColor: theme === "dark" ? "#1f1f1f" : "#e0e0e0",
          }}
          source={{
            uri: (video as Video).key
              ? `https://img.youtube.com/vi/${
                  (video as Video).key
                }/mqdefault.jpg`
              : `https://img.youtube.com/vi/${
                  (video as IGDB.Game.Video).video_id
                }/mqdefault.jpg`,
          }}
        />
      </View>
      <Text
        style={{
          ...iOSUIKit.subheadEmphasizedObject,
          color: iOSColors.gray,

          // ...iOSUIKit.bodyObject,
          marginTop: 8,
          // width: Dimensions.get("window").width / 2 - 40,
        }}
      >
        {video.name}
      </Text>
    </Pressable>
  );
}

export default Trailer;
