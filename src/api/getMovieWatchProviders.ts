import { useQuery } from "@tanstack/react-query";

import { tmdb } from "@/providers/app";

const getProviders = async () =>
  await tmdb.watchProviders.getMovieProviders({
    language: "en-US",
    watch_region: "US",
  });

export function useMovieWatchProviders() {
  return useQuery({
    queryKey: ["movieWatchProviders"],
    queryFn: getProviders,
    select: (providersData) => providersData.results,
  });
}
