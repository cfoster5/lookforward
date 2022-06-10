import React, { useContext, useRef } from "react";
import { Animated, Easing, Pressable, View } from "react-native";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { iOSColors } from "react-native-typography";
import Ionicons from "react-native-vector-icons/Ionicons";
import firestore from "@react-native-firebase/firestore";

import GameContext from "../contexts/GamePlatformPickerContexts";
import SubContext from "../contexts/SubContext";
import TabStackContext from "../contexts/TabStackContext";
import { IGDB } from "../interfaces/igdb";
import { Movie, Recommendation } from "../interfaces/tmdb";

interface Props {
  movieId?: string;
  game?: IGDB.Game.Game;
  inCountdown: boolean;
}

function PosterButton({ movieId, game, inCountdown }: Props) {
  const { user } = useContext(TabStackContext);
  const { setGame } = useContext(GameContext);
  const { games } = useContext(SubContext);

  let docId = "";
  if (movieId) {
    docId = movieId;
  }
  if (game) {
    docId = games.find(
      (releaseDate: IGDB.ReleaseDate.ReleaseDate) =>
        releaseDate.game.id === game.id
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
            { subscribers: firestore.FieldValue.arrayUnion(user) },
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
            subscribers: firestore.FieldValue.arrayRemove(user),
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
      inCountdown ? deleteItem("movies") : addMovieToList();
    }
    if (game) {
      console.log(`data`, game);
      inCountdown ? deleteItem("gameReleases") : setGame(game);
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
          borderColor: "#222",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            height: 36,
            width: 36,
            borderRadius: 18,
            backgroundColor: "#333",
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
