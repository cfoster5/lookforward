import { useQuery } from "@tanstack/react-query";

import { tmdb } from "@/providers/app";
import { useAppConfigStore } from "@/stores/appConfig";

const getMovie = async (movieId: number, language: string, region: string) =>
  await tmdb.movies.details(
    movieId,
    [
      "credits",
      "videos",
      "keywords",
      "recommendations",
      "images",
      "watch/providers",
      "release_dates",
    ],
    `${language}-${region},null`,
  );

export function useMovie(movieId: number) {
  const movieLanguage = useAppConfigStore((state) => state.movieLanguage);
  const movieRegion = useAppConfigStore((state) => state.movieRegion);

  return useQuery({
    queryKey: ["movie", movieId, movieLanguage, movieRegion],
    queryFn: () => getMovie(movieId, movieLanguage, movieRegion),
  });
}
