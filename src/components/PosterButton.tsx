import React, { useContext, useRef } from "react";
import { Animated, Pressable, View, Easing } from "react-native";
import { iOSColors } from "react-native-typography";
import { TMDB } from "../../types";
import Ionicons from "react-native-vector-icons/Ionicons";
import firestore from '@react-native-firebase/firestore';
import UserContext from "../contexts/UserContext";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false
};

interface Props {
  data: TMDB.Movie.Movie;
  inCountdown: boolean;
  mediaType: "movie"
}

function PosterButton({ data, inCountdown, mediaType }: Props) {
  const uid = useContext(UserContext);
  let docId = "";
  docId = data.id.toString()

  const transformAnim = useRef(new Animated.Value(1)).current

  async function addToList() {
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
              () => ReactNativeHapticFeedback.trigger("impactLight", options)
            )
          } catch (error) {
            console.error("Error writing document: ", error);
          }
        }
      );
  }

  async function deleteItem() {
    Animated.timing(transformAnim, {
      toValue: 0,
      duration: 50,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease)
    }).start(
      async () => {
        try {
          await firestore().collection("movies").doc(docId).update({
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

  return (
    <Pressable onPress={() => inCountdown ? deleteItem() : addToList()} style={{ position: "absolute", zIndex: 1, bottom: 4, right: 4 }}>
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
