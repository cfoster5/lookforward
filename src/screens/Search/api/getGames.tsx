import { composeReleasesToGames } from "@/helpers/helpers";
import { useQuery } from "react-query";

import { Game, ReleaseDate } from "@/types";
import { timestamp } from "@/utils/dates";
import { IGDB_AWS_KEY } from "@/constants/ApiKeys";

async function getGames(searchValue: string) {
  if (!searchValue) {
    const fields =
      "fields *, game.name, game.cover.*, platform.abbreviation, platform.name";
    const response = await fetch(
      "https://k0o7ncaic1.execute-api.us-east-2.amazonaws.com/production/v4/release_dates",
      {
        method: "POST",
        headers: { "x-api-key": IGDB_AWS_KEY },
        body: `${fields}; where date > ${Math.floor(
          timestamp
        )} & region = (2,8); limit 100; sort date;`,
      }
    );
    const json: ReleaseDate[] = await response.json();
    return composeReleasesToGames(json);
  } else {
    const response = await fetch(
      "https://k0o7ncaic1.execute-api.us-east-2.amazonaws.com/production/v4/games",
      {
        method: "POST",
        headers: { "x-api-key": IGDB_AWS_KEY },
        body: `fields name, cover.*, release_dates.*, release_dates.platform.abbreviation, release_dates.platform.name;
      where release_dates.region = (2,8);
      search "${searchValue}";
      limit 50;`,
      }
    );
    const json: (Game & { release_dates: ReleaseDate[] })[] =
      await response.json();
    return json;
  }
}

export function useGames(searchValue: string) {
  return useQuery(["games", { searchValue }], () => getGames(searchValue));
}
