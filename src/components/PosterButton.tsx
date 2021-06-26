import React, { useContext, useEffect, useRef } from "react";
import { Animated, Pressable, View, Easing } from "react-native";
import { iOSColors } from "react-native-typography";
import { IGDB, TMDB } from "../../types";
import Ionicons from "react-native-vector-icons/Ionicons";
import firestore from '@react-native-firebase/firestore';
import UserContext from "../contexts/UserContext";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import GameContext from "../contexts/GamePlatformPickerContexts";
import { GameSubContext } from "../contexts/SubContexts";

interface Props {
  data: TMDB.Movie.Movie | IGDB.Game.Game;
  inCountdown: boolean;
  mediaType: "movie" | "game"
}

function PosterButton({ data, inCountdown, mediaType }: Props) {
  const uid = useContext(UserContext);
  const { setGame } = useContext(GameContext);
  const gameSubs = useContext(GameSubContext);

  let docId = "";
  if (mediaType === "movie") {
    docId = data.id.toString();
  }
  if (mediaType === "game") {
    docId = gameSubs.find((releaseDate: IGDB.ReleaseDate.ReleaseDate) => releaseDate.game.id === data.id)?.documentID;
  }

  const transformAnim = useRef(new Animated.Value(1)).current

  async function addMovieToList() {
    Animated.timing(transformAnim, {
      toValue: 0,
      duration: 50,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease)
    })
      .start(
        async () => {
          try {
            await firestore().collection("movies").doc(docId).set((data), { merge: true });
            await firestore().collection("movies").doc(docId).update({
              subscribers: firestore.FieldValue.arrayUnion(uid)
            })
            Animated.timing(transformAnim, {
              toValue: 1,
              duration: 50,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.ease)
            }).start(
              () => ReactNativeHapticFeedback.trigger("impactLight", {
                enableVibrateFallback: true,
                ignoreAndroidSystemSettings: false
              })
            )
          } catch (error) {
            console.error("Error writing document: ", error);
          }
        }
      );
  }

  async function deleteItem(collection: string) {
    Animated.timing(transformAnim, {
      toValue: 0,
      duration: 50,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease)
    }).start(
      async () => {
        try {
          console.log(`docId`, docId)
          await firestore().collection(collection).doc(docId).update({
            subscribers: firestore.FieldValue.arrayRemove(uid)
          })
          Animated.timing(transformAnim, {
            toValue: 1,
            duration: 50,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease)
          }).start()
        } catch (error) {
          console.error("Error writing document: ", error);
        }
      }
    )
  }

  function handlePress() {
    if (mediaType === "movie") {
      inCountdown ? deleteItem("movies") : addMovieToList()
    }
    if (mediaType === "game") {
      console.log(`data`, data)
      inCountdown ? deleteItem("gameReleases") : setGame(data as IGDB.Game.Game);
    }
  }

  return (
    <Pressable
      onPress={handlePress}
      style={{ position: "absolute", zIndex: 1, bottom: 4, right: 4 }}
    >
      <View style={{
        height: 36,
        width: 36,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#222",
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <View style={{
          height: 36,
          width: 36,
          borderRadius: 18,
          backgroundColor: "#333",
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Animated.View style={{ transform: [{ scale: transformAnim }] }}>
            <Ionicons name={inCountdown ? "checkmark-outline" : "add-outline"} color={iOSColors.white} size={28} style={{ textAlign: "center" }} />
          </Animated.View>
        </View>
      </View>
    </Pressable>
  )
}

export default PosterButton
