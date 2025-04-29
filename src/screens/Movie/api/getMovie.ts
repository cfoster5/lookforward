import { useQuery } from "@tanstack/react-query";

import { tmdb } from "@/providers/app";

const getMovie = async (movieId: number) =>
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
    "en,null",
  );

export function useMovie(movieId: number) {
  return useQuery({
    queryKey: ["movie", movieId],
    queryFn: () => getMovie(movieId),
  });
}
