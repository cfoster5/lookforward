import { useQuery } from "react-query";

import { Game, ReleaseDate } from "@/types";
import { IGDB_AWS_KEY } from "@/constants/ApiKeys";

async function getGame(gameId: number) {
  const response = await fetch(
    "https://k0o7ncaic1.execute-api.us-east-2.amazonaws.com/production/v4/games",
    {
      method: "POST",
      headers: { "x-api-key": IGDB_AWS_KEY },
      body: `fields summary, genres.name, involved_companies.developer, involved_companies.porting, involved_companies.publisher, involved_companies.supporting, involved_companies.company.name, videos.name, videos.video_id;
      where id = ${gameId};`,
    }
  );
  const json: (Game & { release_dates: ReleaseDate[] })[] =
    await response.json();
  return json[0];
}

export function useGame(gameId: number) {
  return useQuery(["game", { gameId }], () => getGame(gameId));
}
