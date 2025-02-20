import { useQuery } from "@tanstack/react-query";

import { IGDB_AWS_KEY } from "@/constants/ApiKeys";
import { Game, ReleaseDate } from "@/types";

async function getGame(
  gameId: number,
): Promise<(Game & { release_dates: ReleaseDate[] })[]> {
  const response = await fetch(
    "https://k0o7ncaic1.execute-api.us-east-2.amazonaws.com/production/v4/games",
    {
      method: "POST",
      headers: { "x-api-key": IGDB_AWS_KEY },
      body: `fields summary, genres.name, involved_companies.developer, involved_companies.porting, involved_companies.publisher, involved_companies.supporting, involved_companies.company.name, videos.name, videos.video_id, release_dates.*, release_dates.platform.abbreviation, release_dates.platform.name; 
      where id = ${gameId} & release_dates.region = (2,8);`,
    },
  );
  return await response.json();
}

export const useGame = (gameId: number) =>
  useQuery(["game", { gameId }], () => getGame(gameId), {
    select: (games) => games[0],
  });
