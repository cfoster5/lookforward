import { useEffect, useRef } from "react";
import { Dimensions } from "react-native";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import firestore from "@react-native-firebase/firestore";

import { FirestoreMovie } from "../interfaces/firebase";
import { IGDB } from "../interfaces/igdb";

export const targetedProviders = [
  "Any",
  "Netflix",
  "Apple iTunes",
  "Apple TV Plus",
  "Amazon Prime Video",
  "Amazon Video",
  "Disney Plus",
  // "Starz",
  "Hulu",
  "HBO Max",
  // "Showtime",
  "Google Play Movies",
  "YouTube",
  "Microsoft Store",
  // "Paramount Plus"
];

export const tmdbMovieGenres = [
  { id: 28, name: "Action", icon: "explosion" },
  { id: 12, name: "Adventure", icon: "person-hiking" },
  { id: 16, name: "Animation", icon: "person-running" },
  { id: 35, name: "Comedy", icon: "face-laugh-squint" },
  { id: 80, name: "Crime", icon: "handcuffs" },
  { id: 99, name: "Documentary", icon: "camcorder" },
  { id: 18, name: "Drama", icon: "masks-theater" },
  { id: 10751, name: "Family", icon: "children" },
  { id: 14, name: "Fantasy", icon: "hat-wizard" },
  { id: 36, name: "History", icon: "scroll" },
  { id: 27, name: "Horror", icon: "ghost" },
  { id: 10402, name: "Music", icon: "music" },
  { id: 9648, name: "Mystery", icon: "magnifying-glass" },
  { id: 10749, name: "Romance", icon: "heart" },
  { id: 878, name: "Science Fiction", icon: "rocket" },
  { id: 10770, name: "TV Movie", icon: "tv" },
  { id: 53, name: "Thriller", icon: "user-secret" },
  { id: 10752, name: "War", icon: "jet-fighter" },
  { id: 37, name: "Western", icon: "hat-cowboy" },
];

export function convertReleasesToGames(
  releaseDates: IGDB.ReleaseDate.ReleaseDate[]
): IGDB.Game.Game[] {
  // Converts releases into one game with many releases
  // console.log(releaseDates)
  let games: IGDB.Game.Game[] = [];
  releaseDates.map((releaseDate) => {
    if (releaseDate.game) {
      let game = { ...releaseDate.game, release_dates: [releaseDate] };
      let foundGame = games.find((game) => game.name === releaseDate.game.name);
      // check if game has already been added to games array
      // if so, add tempReleaseDate to foundGame.release_dates
      // if not, add game to games array
      foundGame ? foundGame.release_dates.push(releaseDate) : games.push(game);
    }
  });
  return games;
}

export async function subToMovie(
  movieId: FirestoreMovie["documentID"],
  user: string
) {
  try {
    await firestore()
      .collection("movies")
      .doc(movieId)
      .set(
        { subscribers: firestore.FieldValue.arrayUnion(user) },
        { merge: true }
      );
    ReactNativeHapticFeedback.trigger("impactLight", {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
  } catch (error) {
    console.error("Error writing document: ", error);
  }
}

export async function removeSub(
  collection: string,
  countdownId?: string,
  user: string
) {
  try {
    await firestore()
      .collection(collection)
      .doc(countdownId)
      .update({
        subscribers: firestore.FieldValue.arrayRemove(user),
      });
  } catch (error) {
    console.error("Error writing document: ", error);
  }
}

// Hook
export default function usePrevious(value: any) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();

  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

export function calculateWidth(
  headerSpace: number,
  separatingSpace: number,
  elementCount: number
): number {
  let totalEmptySpace =
    headerSpace + separatingSpace * Math.floor(elementCount);
  return (Dimensions.get("window").width - totalEmptySpace) / elementCount;
}
