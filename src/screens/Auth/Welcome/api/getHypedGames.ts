import { useQuery } from "react-query";

import { igdbProxyKey } from "@/config";

async function getGames() {
  const unixTime = Math.floor(Date.now() / 1000);
  const response = await fetch(
    "https://k0o7ncaic1.execute-api.us-east-2.amazonaws.com/production/v4/games",
    {
      method: "POST",
      headers: { "x-api-key": igdbProxyKey },
      body: `fields name, category, hypes, first_release_date, cover.*, release_dates.*;
    where category = 0 & first_release_date > ${unixTime} & release_dates.region = (2,8) & hypes != null & cover.url != null;
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
