import { useQuery } from "react-query";
import { convertReleasesToGames } from "helpers/helpers";
import { IGDB } from "interfaces/igdb";

async function getGames(searchValue: string) {
  if (!searchValue) {
    const fields =
      "fields *, game.name, game.summary, game.cover.*, game.genres.name, game.videos.name, game.videos.video_id, game.involved_companies.developer, game.involved_companies.porting, game.involved_companies.publisher, game.involved_companies.supporting, game.involved_companies.company.name, platform.abbreviation, platform.name";
    const response = await fetch(
      "https://gou4rcsh6i.execute-api.us-east-1.amazonaws.com/prod/release_dates",
      {
        method: "POST",
        body: `${fields}; where date > ${Math.floor(
          Date.now() / 1000
        )} & region = (2,8); limit 100; sort date;`,
      }
    );
    const json: IGDB.ReleaseDate.ReleaseDate[] = await response.json();
    return convertReleasesToGames(json);
  } else {
    const response = await fetch(
      "https://gou4rcsh6i.execute-api.us-east-1.amazonaws.com/prod/games",
      {
        method: "POST",
        body: `fields name, summary, cover.*, release_dates.*, release_dates.platform.abbreviation, release_dates.platform.name, genres.name, videos.name, videos.video_id, involved_companies.developer, involved_companies.porting, involved_companies.publisher, involved_companies.supporting, involved_companies.company.name;
      where release_dates.region = (2,8);
      search "${searchValue}";
      limit 50;`,
      }
    );
    const json = await response.json();
    return json;
  }
}

export function useGames(searchValue: string) {
  return useQuery(
    ["games", { searchValue: searchValue }],
    () => getGames(searchValue),
    {
      keepPreviousData: true,
    }
  );
}
