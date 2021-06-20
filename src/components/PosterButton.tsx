import React, { useContext } from "react";
import { Pressable, View } from "react-native";
import { iOSColors } from "react-native-typography";
import { TMDB } from "../../types";
import Ionicons from "react-native-vector-icons/Ionicons";
import firestore from '@react-native-firebase/firestore';
import UserContext from "../contexts/UserContext";

interface Props {
  data: TMDB.Movie.Movie;
  inCountdown: boolean;
  mediaType: "movie"
}

function PosterButton({ data, inCountdown, mediaType }: Props) {
  const uid = useContext(UserContext);
  let docId = "";
  docId = data.id.toString()

  async function addToList() {
    try {
      await firestore().collection("movies").doc(docId).set((data), { merge: true });
      await firestore().collection("movies").doc(docId).update({
        subscribers: firestore.FieldValue.arrayUnion(uid)
      })
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  }

  async function deleteItem() {
    try {
      await firestore().collection("movies").doc(docId).update({
        subscribers: firestore.FieldValue.arrayRemove(uid)
      })
    } catch (error) {
      console.error("Error writing document: ", error);
    }
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
          <Ionicons name={inCountdown ? "checkmark-outline" : "add-outline"} color={iOSColors.white} size={28} style={{ textAlign: "center" }} />
        </View>
      </View>
    </Pressable>
  )
}

export default PosterButton
