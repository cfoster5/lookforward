import { useQuery } from "@tanstack/react-query";

import { IGDB_AWS_KEY } from "@/constants/ApiKeys";
import { timestamp } from "@/utils/dates";
import { groupReleasesByGame } from "@/helpers/helpers";

async function getReleases(filter: string) {
  const response = await fetch(
    "https://k0o7ncaic1.execute-api.us-east-2.amazonaws.com/production/v4/release_dates",
    {
      method: "POST",
      headers: { "x-api-key": IGDB_AWS_KEY },
      body: `fields *, game.name, game.summary, game.cover.*, game.genres.name, game.videos.name, game.videos.video_id, game.involved_companies.developer, game.involved_companies.porting, game.involved_companies.publisher, game.involved_companies.supporting, game.involved_companies.company.name, platform.abbreviation, platform.name;
    ${filter};
    limit 100;
    sort date;`,
    },
  );
  const json = await response.json();
  return groupReleasesByGame(json);
}

export function useDiscoverGames({
  genreId,
}: {
  genreId?: number;
  companyId?: number;
  keywordId?: number;
}) {
  let filter = `where date > ${Math.floor(timestamp)} & region = (2,8)`;
  filter += genreId ? ` & game.genres = (${genreId})` : ``;
  // filter += companyId ? `&with_companies=${companyId}` : ``;
  // filter += keywordId ? `&with_keywords=${keywordId}` : ``;
  return useQuery(["discoverGames", { genreId }], () => getReleases(filter));
}
