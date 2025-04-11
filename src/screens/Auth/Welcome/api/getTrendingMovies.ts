import { useQuery } from "@tanstack/react-query";

import { tmdb } from "@/providers/app";

const getTrendingMovies = async () =>
  await tmdb.trending.trending("movie", "week");

export function useTrendingMovies() {
  return useQuery({
    queryKey: ["trendingMovies"],
    queryFn: getTrendingMovies,
    select: (moviesData) => moviesData.results,
  });
}
