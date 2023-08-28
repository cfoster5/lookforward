import { useQuery } from "react-query";

import { IGDB_AWS_KEY } from "@/constants/ApiKeys";
import { composeReleasesToGames } from "@/helpers/helpers";
import { ReleaseDate } from "@/types";
import { timestamp } from "@/utils/dates";

async function getGames() {
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
}

export function useGames() {
  return useQuery(["games"], getGames);
}
