import React, { useContext } from "react";
import { Image, Linking, Pressable, Text } from "react-native";
import { iOSColors, iOSUIKit } from "react-native-typography";

import TabStackContext from "../contexts/TabStackContext";
import { calculateWidth } from "../helpers/helpers";
import { IGDB } from "../interfaces/igdb";
import { Video } from "../interfaces/tmdb";

function Trailer({ video }: { video: Video | IGDB.Game.Video }) {
  const { theme } = useContext(TabStackContext);
  return (
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
      style={{ width: calculateWidth(16, 8, 1.5) }}
    >
      <Image
        style={{
          width: calculateWidth(16, 8, 1.5),
          height: calculateWidth(16, 8, 1.5) / 1.78,
          resizeMode: "cover",
          borderRadius: 8,
          borderWidth: 1,
          borderColor: theme === "dark" ? "#1f1f1f" : "#e0e0e0",
        }}
        source={{
          uri: (video as Video).key
            ? `https://img.youtube.com/vi/${(video as Video).key}/hqdefault.jpg`
            : `https://img.youtube.com/vi/${
                (video as IGDB.Game.Video).video_id
              }/mqdefault.jpg`,
        }}
      />
      <Text
        style={{
          ...iOSUIKit.subheadEmphasizedObject,
          color: iOSColors.gray,
          marginTop: 8,
        }}
      >
        {video.name}
      </Text>
    </Pressable>
  );
}

export default Trailer;
