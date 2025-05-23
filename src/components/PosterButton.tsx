import { Ionicons } from "@expo/vector-icons";
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "@react-native-firebase/firestore";
import { useRef } from "react";
import { Animated, Easing, PlatformColor, Pressable, View } from "react-native";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { iOSColors } from "react-native-typography";

import { useCountdownLimit } from "@/hooks/useCountdownLimit";
import { useStore } from "@/stores/store";
import { Games, ReleaseDate } from "@/types/igdb";

interface Props {
  movieId?: string;
  game?: Games & { release_dates: ReleaseDate[] };
}

function PosterButton({ movieId, game }: Props) {
  const { user, movieSubs, gameSubs, bottomSheetModalRef } = useStore();
  const checkLimit = useCountdownLimit();

  const isMovieSub = () =>
    movieId && movieSubs.some((sub) => sub.documentID === movieId.toString());

  const isGameSub = () =>
    game && gameSubs.some((releaseDate) => releaseDate.game.id === game.id);

  const transformAnim = useRef(new Animated.Value(1)).current;

  async function addMovieToList() {
    // Check limit before adding
    if (!checkLimit("movies")) {
      return; // Limit reached, modal shown
    }

    Animated.timing(transformAnim, {
      toValue: 0,
      duration: 50,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }).start(async () => {
      try {
        const db = getFirestore();
        const docRef = doc(db, "movies", movieId!);
        await setDoc(
          docRef,
          { subscribers: arrayUnion(user!.uid) },
          { merge: true },
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
          }),
        );
      } catch (error) {
        console.error("Error writing document: ", error);
      }
    });
  }

  async function deleteItem(collection: string, docId: string) {
    Animated.timing(transformAnim, {
      toValue: 0,
      duration: 50,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }).start(async () => {
      try {
        const db = getFirestore();
        const docRef = doc(db, collection, docId);
        await updateDoc(docRef, {
          subscribers: arrayRemove(user!.uid),
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

  function toggleMovieSub() {
    return isMovieSub() ? deleteItem("movies", movieId!) : addMovieToList();
  }

  function toggleGameSub() {
    if (isGameSub()) {
      const gameId = gameSubs.find(
        (releaseDate) => releaseDate.game.id === game!.id,
      )?.documentID;
      if (gameId) {
        return deleteItem("gameReleases", gameId);
      }
    } else {
      // Check limit before showing platform picker
      if (!checkLimit("gameReleases")) {
        return; // Limit reached, modal shown
      }
      return bottomSheetModalRef.current?.present(game);
    }
  }

  return (
    <Pressable
      onPress={movieId ? () => toggleMovieSub() : () => toggleGameSub()}
      style={{ position: "absolute", zIndex: 1, bottom: 4, right: 4 }}
    >
      <View
        style={{
          height: 36,
          width: 36,
          borderRadius: 18,
          borderWidth: 1,
          borderColor: PlatformColor("separator"),
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
              name={
                isMovieSub() || isGameSub()
                  ? "checkmark-outline"
                  : "add-outline"
              }
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
