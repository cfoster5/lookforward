import { useQuery } from "@tanstack/react-query";

import { groupReleasesByGame } from "@/helpers/helpers";
import { igdb } from "@/providers/app";
import { timestamp } from "@/utils/dates";

async function getReleases(filter: string) {
  const query = `fields *, game.name, game.summary, game.cover.*, game.genres.name, game.videos.name, game.videos.video_id, game.involved_companies.developer, game.involved_companies.porting, game.involved_companies.publisher, game.involved_companies.supporting, game.involved_companies.company.name, platform.abbreviation, platform.name;
    ${filter};
    limit 100;
    sort date;`;

  const response = await igdb.releaseDates.retreiveReleaseDate(query);
  return groupReleasesByGame(response.data);
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
  return useQuery({
    queryKey: ["discoverGames", filter],
    queryFn: () => getReleases(filter),
  });
}
