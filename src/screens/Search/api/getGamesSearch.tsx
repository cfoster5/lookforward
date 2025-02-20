import { useQuery } from "@tanstack/react-query";

import { IGDB_AWS_KEY } from "@/constants/ApiKeys";
import { useStore } from "@/stores/store";
import { Game, ReleaseDate } from "@/types";

async function getGamesSearch(searchValue: string) {
  const response = await fetch(
    "https://k0o7ncaic1.execute-api.us-east-2.amazonaws.com/production/v4/games",
    {
      method: "POST",
      headers: { "x-api-key": IGDB_AWS_KEY },
      body: `fields name, cover.*, release_dates.*, release_dates.platform.abbreviation, release_dates.platform.name;
      where release_dates.region = (2,8);
      search "${searchValue}";
      limit 50;`,
    },
  );
  const json: (Game & { release_dates: ReleaseDate[] })[] =
    await response.json();
  return json;
}

export function useGamesSearch(searchValue: string) {
  const { categoryIndex } = useStore();
  return useQuery({
    queryKey: ["games", { searchValue }],
    queryFn: () => getGamesSearch(searchValue),
    enabled: categoryIndex === 1 && searchValue !== "",
  });
}
