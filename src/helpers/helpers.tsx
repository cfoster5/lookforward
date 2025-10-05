import {
  arrayRemove,
  arrayUnion,
  doc,
  getFirestore,
  setDoc,
  updateDoc,
} from "@react-native-firebase/firestore";
import { DateTime } from "luxon";
import { Dimensions } from "react-native";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

import { ReleaseDate, Games } from "@/types/igdb";
import { timestampToUTC } from "@/utils/dates";

import { FirestoreMovie } from "../interfaces/firebase";

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
  "Max",
  // "Showtime",
  "Google Play Movies",
  "YouTube",
  "Microsoft Store",
  // "Paramount Plus"
];

export const tmdbMovieGenres = [
  // { id: 28, name: "Action", icon: "explosion" },
  { id: 28, name: "Action", icon: "jet-fighter" },
  { id: 12, name: "Adventure", icon: "person-hiking" },
  { id: 16, name: "Animation", icon: "person-running" },
  { id: 35, name: "Comedy", icon: "face-laugh-squint" },
  { id: 80, name: "Crime", icon: "handcuffs" },
  { id: 99, name: "Documentary", icon: "video-camera" },
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
  // { id: 10752, name: "War", icon: "jet-fighter" },
  { id: 10752, name: "War", icon: "bomb" },
  { id: 37, name: "Western", icon: "hat-cowboy" },
];

// Converts releases into one game with many releases
export function groupReleasesByGame(releaseDates: ReleaseDate[]) {
  const gameMap = releaseDates.reduce((map, releaseDate) => {
    if (releaseDate.game) {
      const gameId = releaseDate.game.id;
      if (map.has(gameId)) {
        const game = map.get(gameId);
        if (game) {
          game.release_dates.push(releaseDate);
        }
      } else {
        map.set(gameId, {
          ...releaseDate.game,
          release_dates: [releaseDate],
        });
      }
    }
    return map;
  }, new Map<number, ReleaseDate["game"] & { release_dates: ReleaseDate[] }>());

  return Array.from(gameMap.values());
}

export async function subToMovie(
  movieId: FirestoreMovie["documentID"],
  user: string,
) {
  try {
    const db = getFirestore();
    const docRef = doc(db, "movies", movieId);
    await setDoc(docRef, { subscribers: arrayUnion(user) }, { merge: true });
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
  countdownId: string,
  user: string,
) {
  try {
    const db = getFirestore();
    const docRef = doc(db, collection, countdownId);
    await updateDoc(docRef, {
      subscribers: arrayRemove(user),
    });
  } catch (error) {
    console.error("Error writing document: ", error);
  }
}

// Calculates the width of each element based on the available window width,
// header space, separating space, and the number of elements.
export function calculateWidth(
  headerSpace: number,
  separatingSpace: number,
  elementCount: number,
) {
  const { width: windowWidth } = Dimensions.get("window");
  // Use Math.floor() to ensure that any fractional space after the last element is ignored
  const totalEmptySpace =
    headerSpace + separatingSpace * Math.floor(elementCount);
  return (windowWidth - totalEmptySpace) / elementCount;
}

export function getGameReleaseDate(
  game: Games & {
    release_dates: ReleaseDate[];
  },
) {
  if (!game || !game.release_dates) {
    return "TBD";
  }
  const uniqueDates = new Set<number>();

  for (const releaseDate of game.release_dates) {
    if (releaseDate.release_region === 2 || releaseDate.release_region === 8) {
      uniqueDates.add(releaseDate.date);
    }
  }

  if (uniqueDates.size === 1) {
    try {
      return timestampToUTC([...uniqueDates][0]).toLocaleString(
        DateTime.DATE_FULL,
      );
    } catch (error) {
      console.log(`error for ${JSON.stringify(game)}`, error);
    }
  } else {
    return "Multiple dates";
  }
}
