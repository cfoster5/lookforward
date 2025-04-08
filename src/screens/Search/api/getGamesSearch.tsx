import { useQuery } from "@tanstack/react-query";

import { igdb } from "@/providers/app";
import { useStore } from "@/stores/store";

async function getGamesSearch(searchValue: string) {
  const query = `fields name, cover.*, release_dates.*, release_dates.platform.abbreviation, release_dates.platform.name;
      where release_dates.region = (2,8);
      search "${searchValue}";
      limit 50;`;

  const response = await igdb.games.retreiveGames(query);
  return response.data;
}

export function useGamesSearch(searchValue: string) {
  const { categoryIndex } = useStore();

  return useQuery({
    queryKey: ["games", { searchValue }],
    queryFn: () => getGamesSearch(searchValue),
    enabled: categoryIndex === 1 && searchValue !== "",
  });
}
