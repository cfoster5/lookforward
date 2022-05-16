import { useEffect, useRef } from "react";

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
