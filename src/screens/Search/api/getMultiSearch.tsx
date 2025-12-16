import { useQuery } from "@tanstack/react-query";

import { tmdb } from "@/providers/app";
import { useInterfaceStore } from "@/stores";
import { useAppConfigStore } from "@/stores/appConfig";

const getMultiSearch = async (searchValue: string, language: string) =>
  await tmdb.search.multi({
    query: searchValue,
    include_adult: false,
    language,
  });

export function useMultiSearch(searchValue: string) {
  const { categoryIndex } = useInterfaceStore();
  const movieLanguage = useAppConfigStore((state) => state.movieLanguage);
  const movieRegion = useAppConfigStore((state) => state.movieRegion);

  return useQuery({
    queryKey: ["movieSearch", searchValue, movieLanguage, movieRegion],
    queryFn: () =>
      getMultiSearch(searchValue, `${movieLanguage}-${movieRegion}`),
    enabled: categoryIndex === 0 && searchValue !== "",
  });
}
