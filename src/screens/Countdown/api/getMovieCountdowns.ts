import { useQueries } from "@tanstack/react-query";

import { getPreferredReleaseDate } from "@/helpers/getPreferredReleaseDate";
import { getReleaseDatesByCountry } from "@/helpers/getReleaseDatesByCountry";
import { FirestoreMovie } from "@/interfaces/firebase";
import { tmdb } from "@/providers/app";
import { useAppConfigStore } from "@/stores/appConfig";
import { useSubscriptionStore } from "@/stores/subscription";

export async function getMovie(
  movieId: FirestoreMovie["documentID"],
  language: string,
  region: string,
) {
  const json = await tmdb.movies.details(
    Number(movieId),
    ["release_dates"],
    `${language}-${region}`,
  );

  const releaseDates = getReleaseDatesByCountry(json.release_dates);

  const preferred = releaseDates
    ? getPreferredReleaseDate(releaseDates)
    : undefined;

  const date = preferred?.release_date;

  return {
    ...json,
    releaseDate: date,
    documentID: movieId,
  };
}

// Rename this function and this file
export function useMovieCountdowns() {
  const { movieSubs } = useSubscriptionStore();
  const movieLanguage = useAppConfigStore((state) => state.movieLanguage);
  const movieRegion = useAppConfigStore((state) => state.movieRegion);

  return useQueries({
    queries: movieSubs.map((sub) => ({
      queryKey: ["movieSub", sub.documentID, movieLanguage, movieRegion],
      queryFn: () => getMovie(sub.documentID, movieLanguage, movieRegion),
    })),
    combine: (results) => ({
      data: results.map((result) => result.data),
      pending: results.some((result) => result.isPending),
    }),
  });
}
