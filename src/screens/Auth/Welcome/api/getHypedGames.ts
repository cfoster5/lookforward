import { useQuery } from "@tanstack/react-query";

import { igdb } from "@/providers/app";
import { timestamp } from "@/utils/dates";

async function getGames() {
  const query = `
    fields name, category, hypes, first_release_date, cover.*, release_dates.*;
    where category = 0 & first_release_date > ${Math.floor(
      timestamp,
    )} & release_dates.release_region = (2,8) & hypes != null & cover.url != null;
    sort hypes desc;
    limit 10;
  `;

  const response = await igdb.games.retreiveGames(query);
  return response.data;
}

export function useHypedGames() {
  return useQuery({ queryKey: ["hypedGames"], queryFn: getGames });
}
