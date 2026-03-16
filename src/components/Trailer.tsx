import { Image } from "expo-image";
import { useState } from "react";
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  Modal,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { iOSUIKit } from "react-native-typography";
import YoutubePlayer from "react-native-youtube-iframe";
import { Video as MovieVideo } from "tmdb-ts";

import { calculateWidth } from "@/helpers/helpers";
import { colors } from "@/theme/colors";
import { GameVideo } from "@/types/igdb";

type TrailerProps = {
  video: MovieVideo | GameVideo;
};

function Trailer({ video }: TrailerProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const { width: screenWidth } = useWindowDimensions();
  const playerHeight = (screenWidth / 16) * 9;
  const playing = modalVisible;
  const videoId = (video as MovieVideo).key || (video as GameVideo).video_id;
  const { top: topInset, left: leftInset } = useSafeAreaInsets();

  return (
    <>
      <Pressable
        onPress={() => setModalVisible(true)}
        style={{ width: calculateWidth(16, 8, 1.5) }}
      >
        <Image
          style={styles.thumbnail}
          source={{
            uri: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          }}
          contentFit="cover"
        />
        <Text
          numberOfLines={2}
          style={[iOSUIKit.subhead, { color: colors.label, marginTop: 8 }]}
        >
          {video.name}
        </Text>
      </Pressable>
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.container}>
          <YoutubePlayer
            height={playerHeight}
            width={screenWidth}
            play={playing}
            videoId={videoId}
            onChangeState={(state) => {
              if (state === "ended") setModalVisible(false);
            }}
          />
          <Pressable
            style={[styles.closeButton, { top: topInset, left: leftInset }]}
            accessibilityLabel="Close video"
            onPress={() => setModalVisible(false)}
          >
            <Text style={[iOSUIKit.body, { color: colors.label }]}>Close</Text>
          </Pressable>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  thumbnail: {
    aspectRatio: 16 / 9,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.separator,
  },
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    paddingLeft: 16,
  },
});

export default Trailer;
