import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { useEffect, useRef } from "react";
import { IGDB } from "../../types";

export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

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
]

export async function convertReleasesToGames(releaseDates: IGDB.ReleaseDate.ReleaseDate[]): Promise<IGDB.Game.Game[]> {
  // Converts releases into one game with many releases
  // console.log(releaseDates)
  let games: IGDB.Game.Game[] = [];
  releaseDates.forEach(releaseDate => {
    if (releaseDate.game) {
      let foundGame = games.find(game => game.name === releaseDate.game.name);
      // console.log(foundGame);
      let tempReleaseDate = {
        id: releaseDate.id,
        category: releaseDate.category,
        created_at: releaseDate.created_at,
        date: releaseDate.date,
        game: releaseDate.game.id,
        human: releaseDate.human,
        m: releaseDate.m,
        platform: releaseDate.platform,
        region: releaseDate.region,
        updated_at: releaseDate.updated_at,
        y: releaseDate.y,
        checksum: releaseDate.checksum
      }
      let game: IGDB.Game.Game = {
        id: releaseDate.game.id,
        cover: releaseDate.game.cover,
        genres: releaseDate.game.genres,
        name: releaseDate.game.name,
        release_dates: [tempReleaseDate],
        summary: releaseDate.game.summary,
        videos: releaseDate.game.videos,
        involved_companies: releaseDate.game.involved_companies
      };
      foundGame ? foundGame.release_dates.push(tempReleaseDate) : games.push(game);
    }
  });
  return games;
}

export function onResult(querySnapshot: FirebaseFirestoreTypes.QuerySnapshot) {
  // console.log(querySnapshot.docs);
  let tempMedia: any = []
  querySnapshot.docs.forEach(doc => {
    // console.log(doc.data())
    let data = doc.data();
    data.documentID = doc.id;
    tempMedia.push(data);
  });
  // State change here is forcing user back to home page on addToList();
  return tempMedia;
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