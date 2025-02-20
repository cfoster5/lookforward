import { useQueries } from "@tanstack/react-query";

import { IGDB_AWS_KEY } from "@/constants/ApiKeys";
import { useStore } from "@/stores/store";

type ReleaseDate = {
  date: number;
  game: {
    cover: {
      id: number;
      alpha_channel: boolean;
      animated: boolean;
      game: number;
      height: number;
      image_id: string;
      url: string;
      width: number;
      checksum: string;
    };
    id: number;
    name: string;
  };
  human: string;
  id: number;
};

async function getGameRelease(releaseId: string) {
  const response = await fetch(
    "https://k0o7ncaic1.execute-api.us-east-2.amazonaws.com/production/v4/release_dates",
    {
      method: "POST",
      headers: { "x-api-key": IGDB_AWS_KEY },
      body: `fields human, date, game.name, game.cover.*; where id = ${releaseId};`,
    },
  );
  const json: ReleaseDate[] = await response.json();
  return json[0];
}

export function useGameCountdowns() {
  const { gameSubs } = useStore();
  return useQueries({
    queries: gameSubs.map((sub) => {
      return {
        queryKey: ["gameRelease", sub.documentID],
        queryFn: () => getGameRelease(sub.documentID),
      };
    }),
  });
}
