import { useEffect, useState } from "react";

import { IGDB } from "../interfaces/igdb";

export function useConvertReleasesToGames(
  releaseDates: IGDB.ReleaseDate.ReleaseDate[]
): IGDB.Game.Game[] {
  const [games, setGames] = useState<IGDB.Game.Game[]>([]);

  // Converts releases into one game with many releases
  // console.log(releaseDates)

  useEffect(() => {
    releaseDates.map((releaseDate) => {
      if (releaseDate.game) {
        const game = { ...releaseDate.game, release_dates: [releaseDate] };
        const foundGame = games.find(
          (game) => game.name === releaseDate.game.name
        );
        // check if game has already been added to games array
        // if so, add tempReleaseDate to foundGame.release_dates
        // if not, add game to games array
        foundGame
          ? foundGame.release_dates.push(releaseDate)
          : games.push(game);
      }
    });
  }, [releaseDates]);

  return games;
}
