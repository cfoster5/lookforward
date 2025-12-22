import { useQueries } from "@tanstack/react-query";

import { igdb } from "@/providers/app";
import { useSubscriptionStore } from "@/stores";
import { ReleaseDate } from "@/types/igdb";

export async function getGameRelease(releaseId: ReleaseDate["id"]) {
  const query = `fields human, date, game.name, game.cover.*; where id = ${releaseId};`;
  const response = await igdb.releaseDates.retreiveReleaseDate(query);
  return response.data;
}

export function useGameCountdowns() {
  const { gameSubs } = useSubscriptionStore();
  return useQueries({
    queries: gameSubs.map((sub) => ({
      queryKey: ["gameRelease", Number(sub.documentID)],
      queryFn: () => getGameRelease(Number(sub.documentID)),
      select: (releaseDates) => releaseDates[0],
    })),
    combine: (results) => ({
      data: results.map((result) => result.data),
      pending: results.some((result) => result.isPending),
    }),
  });
}
