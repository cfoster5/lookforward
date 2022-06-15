import { useEffect, useState } from "react";

import { IGDB } from "../interfaces/igdb";

export function useGetUpcomingGameReleases() {
  const [gameReleases, setGameReleases] = useState<
    IGDB.ReleaseDate.ReleaseDate[]
  >([]);

  useEffect(() => {
    async function getUpcomingGameReleases() {
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
      const json = await response.json();
      setGameReleases(json);
    }
    getUpcomingGameReleases();
  }, []);

  return gameReleases;
}
