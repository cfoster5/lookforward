import { Image } from "expo-image";
import { useState, useMemo } from "react";
import {
  PlatformColor,
  Pressable,
  Text,
  View,
  StyleSheet,
  Dimensions,
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { iOSUIKit } from "react-native-typography";
import YoutubePlayer from "react-native-youtube-iframe";
import { Video as MovieVideo } from "tmdb-ts";

import { calculateWidth } from "@/helpers/helpers";
import { GameVideo } from "@/types/igdb";

type TrailerProps = {
  video: MovieVideo | GameVideo;
};

const imageStyles = StyleSheet.create({
  thumbnail: {
    aspectRatio: 16 / 9,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: PlatformColor("separator"),
  },
});

const titleStyle = [iOSUIKit.subhead, { color: PlatformColor("label"), marginTop: 8 }];

function Trailer({ video }: TrailerProps) {
  const [modalVisible, setModalVisible] = useState(false);
  // calculate player dimensions
  const screenWidth = Dimensions.get("window").width;
  const playerHeight = (screenWidth / 16) * 9;
  const playing = modalVisible;
  const videoId = (video as MovieVideo).key || (video as GameVideo).video_id;
  const { top: topInset, left: leftInset } = useSafeAreaInsets();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: "black",
          justifyContent: "center",
          alignItems: "center",
        },
        closeButton: {
          position: "absolute",
          top: topInset,
          left: leftInset,
          paddingLeft: 16,
        },
      }),
    [topInset, leftInset],
  );

  const pressableStyle = useMemo(
    () => ({ width: calculateWidth(16, 8, 1.5) }),
    [],
  );

  return (
    <>
      <Pressable
        onPress={() => setModalVisible(true)}
        style={pressableStyle}
      >
        <Image
          style={imageStyles.thumbnail}
          source={{
            uri: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          }}
          contentFit="cover"
        />
        <Text
          numberOfLines={2}
          style={titleStyle}
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
            style={styles.closeButton}
            accessibilityLabel="Close video"
            onPress={() => setModalVisible(false)}
          >
            <Text style={[iOSUIKit.body, { color: PlatformColor("label") }]}>
              Close
            </Text>
          </Pressable>
        </View>
      </Modal>
    </>
  );
}

export default Trailer;
