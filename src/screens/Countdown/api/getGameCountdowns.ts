import { useQueries } from "react-query";

import { igdb } from "@/providers/app";
import { useStore } from "@/stores/store";
import { ReleaseDate } from "@/types/igdb";

export async function getGameRelease(releaseId: ReleaseDate["id"]) {
  const query = `fields human, date, game.name, game.cover.*; where id = ${releaseId};`;
  const response = await igdb.releaseDates.retreiveReleaseDate(query);
  return response.data[0];
}

export function useGameCountdowns() {
  const { gameSubs } = useStore();
  return useQueries(
    gameSubs.map((sub) => {
      return {
        queryKey: ["gameRelease", Number(sub.documentID)],
        queryFn: () => getGameRelease(Number(sub.documentID)),
      };
    }),
  );
}
