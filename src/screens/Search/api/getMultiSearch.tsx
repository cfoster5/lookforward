import { useQuery } from "@tanstack/react-query";

import { tmdb } from "@/providers/app";
import { useInterfaceStore } from "@/stores";

const getMultiSearch = async (searchValue: string) =>
  await tmdb.search.multi({
    query: searchValue,
    include_adult: false,
    language: "en-US",
  });

export function useMultiSearch(searchValue: string) {
  const { categoryIndex } = useInterfaceStore();
  return useQuery({
    queryKey: ["movieSearch", searchValue],
    queryFn: () => getMultiSearch(searchValue),
    enabled: categoryIndex === 0 && searchValue !== "",
  });
}
