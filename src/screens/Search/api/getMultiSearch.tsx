import { useQuery } from "@tanstack/react-query";

import { tmdb } from "@/providers/app";
import { useStore } from "@/stores/store";

async function getMultiSearch(searchValue: string) {
  return await tmdb.search.multi({
    query: searchValue,
    include_adult: false,
    language: "en-US",
  });
}

export function useMultiSearch(searchValue: string) {
  const { categoryIndex } = useStore();
  return useQuery({
    queryKey: ["movieSearch", searchValue],
    queryFn: () => getMultiSearch(searchValue),
    enabled: categoryIndex === 0 && searchValue !== "",
  });
}
