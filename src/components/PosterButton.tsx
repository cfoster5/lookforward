import React from "react";
import { Pressable, View } from "react-native";
import { iOSColors } from "react-native-typography";
import { IGDB, TMDB, Trakt } from "../../types";
import Ionicons from "react-native-vector-icons/Ionicons";
import firestore from '@react-native-firebase/firestore';

interface Props {
  data: TMDB.Movie.Movie | Trakt.ShowPremiere;
  inCountdown: boolean;
  uid: string;
  mediaType: "movie" | "tv"
}

function PosterButton({ data, inCountdown, uid, mediaType }: Props) {
  let docId = "";
  docId = mediaType === "movie" ? (data as TMDB.Movie.Movie).id.toString() : (data as Trakt.ShowPremiere).show.ids.trakt.toString();

  async function addToList() {
    try {
      await firestore().collection(mediaType === "movie" ? "movies" : "shows").doc(docId).set((data), { merge: true });
      console.log("Document successfully written!");
      await firestore().collection(mediaType === "movie" ? "movies" : "shows").doc(docId).update({
        subscribers: firestore.FieldValue.arrayUnion(uid)
      })
      console.log("Document updated written!");
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  }

  async function deleteItem() {
    try {
      await firestore().collection(mediaType === "movie" ? "movies" : "shows").doc(docId).update({
        subscribers: firestore.FieldValue.arrayRemove(uid)
      })
      console.log("Document successfully written!");
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
