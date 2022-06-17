import { useQuery } from "react-query";

async function getReleases(filter: string) {
  const response = await fetch(
    "https://gou4rcsh6i.execute-api.us-east-1.amazonaws.com/prod/release_dates",
    {
      method: "POST",
      body: `fields *, game.name, game.summary, game.cover.*, game.genres.name, game.videos.name, game.videos.video_id, game.involved_companies.developer, game.involved_companies.porting, game.involved_companies.publisher, game.involved_companies.supporting, game.involved_companies.company.name, platform.abbreviation, platform.name;
    ${filter};
    limit 100;
    sort date;`,
    }
  );
  const json = await response.json();
  return json;
}

export function useDiscoverGames({
  genreId,
}: {
  genreId?: number;
  companyId?: number;
  keywordId?: number;
}) {
  let filter = `where date > ${Math.floor(Date.now() / 1000)} & region = (2,8)`;
  filter += genreId ? ` & game.genres = (${genreId})` : ``;
  // filter += companyId ? `&with_companies=${companyId}` : ``;
  // filter += keywordId ? `&with_keywords=${keywordId}` : ``;
  return useQuery(["discoverGames", { genreId: genreId }], () =>
    getReleases(filter)
  );
}
