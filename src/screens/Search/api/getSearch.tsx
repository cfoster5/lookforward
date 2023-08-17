import { useQuery } from "react-query";
import { MultiSearchResult, Search } from "tmdb-ts";

import { TMDB_KEY } from "@/constants/ApiKeys";

async function fetchSearch(searchValue: string) {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_KEY}&language=en-US&query=${searchValue}&include_adult=false&region=US`
  );
  const json: Search<MultiSearchResult> = await response.json();
  return json;
}

export function useSearchData(searchValue: string) {
  return useQuery(
    ["movieSearch", searchValue],
    () => fetchSearch(searchValue),
    { enabled: searchValue !== "" }
  );
}
