import { useQuery } from "react-query";

async function getGames() {
  const response = await fetch(
    "https://gou4rcsh6i.execute-api.us-east-1.amazonaws.com/prod/games",
    {
      method: "POST",
      body: `fields name, category, hypes, first_release_date, cover.*, release_dates.*;
    where category = 0 & first_release_date > ${Math.floor(
      Date.now() / 1000
    )} & release_dates.region = (2,8) & hypes != null & cover.url != null;
    sort hypes desc;
    limit 10;`,
    }
  );
  const json = await response.json();
  return json;
}

export function useHypedGames() {
  return useQuery(["hypedGames"], getGames);
}
