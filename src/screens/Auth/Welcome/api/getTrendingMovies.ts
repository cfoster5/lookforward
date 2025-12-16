import { useQuery } from "@tanstack/react-query";

import { tmdb } from "@/providers/app";
import { useAppConfigStore } from "@/stores/appConfig";

const getTrendingMovies = async (language: string, region: string) =>
  await tmdb.trending.trending("movie", "week", {
    language: `${language}-${region}`,
  });

export function useTrendingMovies() {
  const movieLanguage = useAppConfigStore((state) => state.movieLanguage);
  const movieRegion = useAppConfigStore((state) => state.movieRegion);

  return useQuery({
    queryKey: ["trendingMovies", movieLanguage, movieRegion],
    queryFn: () => getTrendingMovies(movieLanguage, movieRegion),
    select: (moviesData) => moviesData.results,
  });
}
