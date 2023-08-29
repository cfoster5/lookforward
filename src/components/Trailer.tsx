import { Image } from "expo-image";
import { Linking, PlatformColor, Pressable, Text } from "react-native";
import { iOSUIKit } from "react-native-typography";
import { Video } from "tmdb-ts";

import { calculateWidth } from "../helpers/helpers";

import { Video as GameVideo } from "@/types";

function Trailer({ video }: { video: Video | GameVideo }) {
  return (
    <Pressable
      onPress={() =>
        Linking.openURL(
          (video as Video).key
            ? `https://www.youtube.com/watch?v=${(video as Video).key}`
            : `https://www.youtube.com/watch?v=${(video as GameVideo).video_id}`
        )
      }
      style={{ width: calculateWidth(16, 8, 1.5) }}
    >
      <Image
        style={{
          aspectRatio: 16 / 9,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: PlatformColor("separator"),
        }}
        source={{
          uri: (video as Video).key
            ? `https://img.youtube.com/vi/${(video as Video).key}/hqdefault.jpg`
            : `https://img.youtube.com/vi/${
                (video as GameVideo).video_id
              }/mqdefault.jpg`,
        }}
        contentFit="cover"
      />
      <Text
        style={[
          iOSUIKit.subheadEmphasized,
          {
            color: PlatformColor("secondaryLabel"),
            marginTop: 8,
          },
        ]}
      >
        {video.name}
      </Text>
    </Pressable>
  );
}

export default Trailer;
