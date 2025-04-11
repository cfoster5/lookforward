import { useQueries } from "@tanstack/react-query";

import { igdb } from "@/providers/app";
import { useStore } from "@/stores/store";
import { ReleaseDate } from "@/types/igdb";

export async function getGameRelease(releaseId: ReleaseDate["id"]) {
  const query = `fields human, date, game.name, game.cover.*; where id = ${releaseId};`;
  const response = await igdb.releaseDates.retreiveReleaseDate(query);
  return response.data;
}

export function useGameCountdowns() {
  const { gameSubs } = useStore();
  return useQueries({
    queries: gameSubs.map((sub) => ({
      queryKey: ["gameRelease", Number(sub.documentID)],
      queryFn: () => getGameRelease(Number(sub.documentID)),
      select: (releaseDates) => releaseDates[0],
    })),
  });
}
