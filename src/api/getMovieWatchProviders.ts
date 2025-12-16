import { useQuery } from "@tanstack/react-query";

import { tmdb } from "@/providers/app";
import { useAppConfigStore } from "@/stores/appConfig";

const getProviders = async (language: string, region: string) =>
  await tmdb.watchProviders.getMovieProviders({
    language: `${language}-${region}`,
    watch_region: region,
  });

export function useMovieWatchProviders() {
  const movieLanguage = useAppConfigStore((state) => state.movieLanguage);
  const movieRegion = useAppConfigStore((state) => state.movieRegion);

  return useQuery({
    queryKey: ["movieWatchProviders", movieLanguage, movieRegion],
    queryFn: () => getProviders(movieLanguage, movieRegion),
    select: (providersData) => providersData.results,
  });
}
