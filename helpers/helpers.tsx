import { IGDB, TMDB } from "../types";

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

export async function convertReleasesToGames(releaseDates: IGDB.ReleaseDate.ReleaseDate[]): Promise<IGDB.Game.Game[]> {
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
      };
      foundGame ? foundGame.release_dates.push(tempReleaseDate) : games.push(game);
    }
  });
  return games;
}
