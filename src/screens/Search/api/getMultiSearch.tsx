import { useQuery } from "@tanstack/react-query";
import { MultiSearchResult, Search } from "tmdb-ts";

import { TMDB_KEY } from "@/constants/ApiKeys";
import { useStore } from "@/stores/store";

async function getMultiSearch(searchValue: string) {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_KEY}&language=en-US&query=${searchValue}&include_adult=false&region=US`,
  );
  const json: Search<MultiSearchResult> = await response.json();
  return json;
}

export function useMultiSearch(searchValue: string) {
  const { categoryIndex } = useStore();
  return useQuery({
    queryKey: ["movieSearch", searchValue],
    queryFn: () => getMultiSearch(searchValue),
    enabled: categoryIndex === 0 && searchValue !== "",
  });
}
