import { Image } from "expo-image";
import { Linking, PlatformColor, Pressable, Text } from "react-native";
import { iOSUIKit } from "react-native-typography";
import { Video as MovieVideo } from "tmdb-ts";

import { calculateWidth } from "@/helpers/helpers";
import { Video as GameVideo } from "@/types";

type TrailerProps = {
  video: MovieVideo | GameVideo;
};

function Trailer({ video }: TrailerProps) {
  const videoId = (video as MovieVideo).key || (video as GameVideo).video_id;
  return (
    <Pressable
      onPress={() =>
        Linking.openURL(`https://www.youtube.com/watch?v=${videoId}`)
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
        source={{ uri: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` }}
        contentFit="cover"
      />
      <Text
        style={[
          iOSUIKit.subhead,
          { color: PlatformColor("label"), marginTop: 8 },
        ]}
      >
        {video.name}
      </Text>
    </Pressable>
  );
}

export default Trailer;
