import { IGDB } from "../interfaces/igdb";

export async function searchGames(
  searchVal: string
): Promise<IGDB.Game.Game[]> {
  const response = await fetch(
    "https://gou4rcsh6i.execute-api.us-east-1.amazonaws.com/prod/games",
    {
      method: "POST",
      body: `fields name, summary, cover.*, release_dates.*, release_dates.platform.abbreviation, release_dates.platform.name, genres.name, videos.name, videos.video_id, involved_companies.developer, involved_companies.porting, involved_companies.publisher, involved_companies.supporting, involved_companies.company.name;
    where release_dates.date > ${Math.floor(
      Date.now() / 1000
    )} & release_dates.region = (2,8);
    search "${searchVal}";
    limit 50;`,
    }
  );
  const json = await response.json();
  return json;
}

export async function discoverGames({
  genreId,
}: {
  genreId?: number;
  companyId?: number;
  keywordId?: number;
}): Promise<IGDB.ReleaseDate.ReleaseDate[]> {
  let filter = `where date > ${Math.floor(Date.now() / 1000)} & region = (2,8)`;
  filter += genreId ? ` & game.genres = (${genreId})` : ``;
  // filter += companyId ? `&with_companies=${companyId}` : ``;
  // filter += keywordId ? `&with_keywords=${keywordId}` : ``;
  console.log(`filter`, filter);
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
