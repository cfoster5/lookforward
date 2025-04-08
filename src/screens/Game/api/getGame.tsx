import { useQuery } from "@tanstack/react-query";

import { igdb } from "@/providers/app";
import { Games } from "@/types/igdb";

async function getGame(gameId: Games["id"]) {
  const query = `fields summary, genres.name, involved_companies.developer, involved_companies.porting, involved_companies.publisher, involved_companies.supporting, involved_companies.company.name, videos.name, videos.video_id, release_dates.*, release_dates.platform.abbreviation, release_dates.platform.name;
      where id = ${gameId} & release_dates.region = (2,8);`;

  const response = await igdb.games.retreiveGames(query);
  return response.data;
}

export const useGame = (gameId: Games["id"]) =>
  useQuery({
    queryKey: ["game", { gameId }],
    queryFn: () => getGame(gameId),
    select: (games) => games[0],
  });
