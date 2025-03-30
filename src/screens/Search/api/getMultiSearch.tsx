import { useLocales } from "expo-localization";
import { useQuery } from "react-query";
import { MultiSearchResult, Search } from "tmdb-ts";

import { TMDB_KEY } from "@/constants/ApiKeys";
import { useStore } from "@/stores/store";

async function getMultiSearch(
  searchValue: string,
  locale: ReturnType<typeof useLocales>[number],
) {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_KEY}&language=${locale.languageTag ?? "en-US"}&query=${searchValue}&include_adult=false&region=${locale.regionCode ?? "US"}`,
  );
  const json: Search<MultiSearchResult> = await response.json();
  return json;
}

export function useMultiSearch(searchValue: string) {
  const { categoryIndex } = useStore();
  const [locale] = useLocales();
  return useQuery(
    ["movieSearch", searchValue],
    () => getMultiSearch(searchValue, locale),
    { enabled: categoryIndex === 0 && searchValue !== "" },
  );
}
