import { composeReleasesToGames } from "helpers/helpers";
import { useQuery } from "react-query";

import { igdbProxyKey } from "@/config";
import { Game, ReleaseDate } from "@/types";

async function getGames(searchValue: string) {
  if (!searchValue) {
    const unixTime = Math.floor(Date.now() / 1000);
    const fields =
      "fields *, game.name, game.summary, game.cover.*, game.genres.name, game.videos.name, game.videos.video_id, game.involved_companies.developer, game.involved_companies.porting, game.involved_companies.publisher, game.involved_companies.supporting, game.involved_companies.company.name, platform.abbreviation, platform.name";
    const response = await fetch(
      "https://k0o7ncaic1.execute-api.us-east-2.amazonaws.com/production/v4/release_dates",
      {
        method: "POST",
        headers: { "x-api-key": igdbProxyKey },
        body: `${fields}; where date > ${unixTime} & region = (2,8); limit 100; sort date;`,
      }
    );
    const json: ReleaseDate[] = await response.json();
    return composeReleasesToGames(json);
  } else {
    const response = await fetch(
      "https://k0o7ncaic1.execute-api.us-east-2.amazonaws.com/production/v4/games",
      {
        method: "POST",
        headers: { "x-api-key": igdbProxyKey },
        body: `fields name, summary, cover.*, release_dates.*, release_dates.platform.abbreviation, release_dates.platform.name, genres.name, videos.name, videos.video_id, involved_companies.developer, involved_companies.porting, involved_companies.publisher, involved_companies.supporting, involved_companies.company.name;
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
  return useQuery(["games", { searchValue }], () => getGames(searchValue), {
    keepPreviousData: true,
  });
}
