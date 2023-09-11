import { useQueries } from "react-query";

import { IGDB_AWS_KEY } from "@/constants/ApiKeys";
import { useStore } from "@/stores/store";

type ReleaseDate = {
  date: number;
  game: { cover: any; id: number; name: string };
  human: string;
  id: number;
};

async function getGameRelease(releaseId: number) {
  const response = await fetch(
    "https://k0o7ncaic1.execute-api.us-east-2.amazonaws.com/production/v4/release_dates",
    {
      method: "POST",
      headers: { "x-api-key": IGDB_AWS_KEY },
      body: `fields human, date, game.name, game.cover.*; where id = ${releaseId};`,
    }
  );
  const json: ReleaseDate[] = await response.json();
  return json[0];
}

export function useGameCountdowns() {
  const { gameSubs } = useStore();
  return useQueries(
    gameSubs.map((sub) => {
      return {
        queryKey: ["gameRelease", sub.documentID],
        queryFn: () => getGameRelease(sub.documentID),
      };
    })
  );
}
