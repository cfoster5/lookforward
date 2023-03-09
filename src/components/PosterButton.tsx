import firestore from "@react-native-firebase/firestore";
import React, { useRef } from "react";
import { Animated, Easing, PlatformColor, Pressable, View } from "react-native";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { iOSColors } from "react-native-typography";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useStore } from "@/stores/store";
import { Game, ReleaseDate } from "@/types";

interface Props {
  movieId?: string;
  game?: Game & { release_dates: ReleaseDate[] };
  inCountdown: boolean;
}

function PosterButton({ movieId, game, inCountdown }: Props) {
  const { user, setGame, gameSubs } = useStore();

  let docId = "";
  if (movieId) {
    docId = movieId;
  }
  if (game) {
    docId = gameSubs.find(
      (releaseDate) => releaseDate.game.id === game.id
    )?.documentID;
  }

  const transformAnim = useRef(new Animated.Value(1)).current;

  async function addMovieToList() {
    Animated.timing(transformAnim, {
      toValue: 0,
      duration: 50,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }).start(async () => {
      try {
        await firestore()
          .collection("movies")
          .doc(docId)
          .set(
            { subscribers: firestore.FieldValue.arrayUnion(user!.uid) },
            { merge: true }
          );
        Animated.timing(transformAnim, {
          toValue: 1,
          duration: 50,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }).start(() =>
          ReactNativeHapticFeedback.trigger("impactLight", {
            enableVibrateFallback: true,
            ignoreAndroidSystemSettings: false,
          })
        );
      } catch (error) {
        console.error("Error writing document: ", error);
      }
    });
  }

  async function deleteItem(collection: string) {
    Animated.timing(transformAnim, {
      toValue: 0,
      duration: 50,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }).start(async () => {
      try {
        console.log(`docId`, docId);
        await firestore()
          .collection(collection)
          .doc(docId)
          .update({
            subscribers: firestore.FieldValue.arrayRemove(user!.uid),
          });
        Animated.timing(transformAnim, {
          toValue: 1,
          duration: 50,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }).start();
      } catch (error) {
        console.error("Error writing document: ", error);
      }
    });
  }

  function handlePress() {
    if (movieId) {
      if (inCountdown) deleteItem("movies");
      else addMovieToList();
    } else if (game) {
      if (inCountdown) deleteItem("gameReleases");
      else setGame(game);
      // inCountdown ? deleteItem("gameReleases") : openModal(game);
      // Open platform modal directly here
    }
  }

  return (
    <Pressable
      onPress={handlePress}
      style={{ position: "absolute", zIndex: 1, bottom: 4, right: 4 }}
    >
      <View
        style={{
          height: 36,
          width: 36,
          borderRadius: 18,
          borderWidth: 1,
          borderColor: PlatformColor("systemGray6"),
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            height: 36,
            width: 36,
            borderRadius: 18,
            backgroundColor: PlatformColor("systemGray5"),
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Animated.View style={{ transform: [{ scale: transformAnim }] }}>
            <Ionicons
              name={inCountdown ? "checkmark-outline" : "add-outline"}
              color={iOSColors.white}
              size={28}
              style={{ textAlign: "center" }}
            />
          </Animated.View>
        </View>
      </View>
    </Pressable>
  );
}

export default PosterButton;
