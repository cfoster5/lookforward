import { useQuery } from "react-query";

import { groupReleasesByGame } from "@/helpers/helpers";
import { igdb } from "@/providers/app";
import { timestamp } from "@/utils/dates";

async function getGames() {
  const query = `fields *, game.name, game.cover.*, platform.abbreviation, platform.name; where date > ${Math.floor(timestamp)} & region = (2,8); limit 100; sort date;`;
  const response = await igdb.releaseDates.retreiveReleaseDate(query);
  return groupReleasesByGame(response.data);
}

export function useGames() {
  return useQuery(["games"], getGames);
}
