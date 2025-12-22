import { useQueries } from "@tanstack/react-query";
import { ReleaseDateType } from "tmdb-ts";

import { getReleaseDatesByCountry } from "@/helpers/getReleaseDatesByCountry";
import { FirestoreMovie } from "@/interfaces/firebase";
import { tmdb } from "@/providers/app";
import { useSubscriptionStore } from "@/stores";
import { useAppConfigStore } from "@/stores/appConfig";
import { compareDates, isoToUTC } from "@/utils/dates";

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

  const sortedNonPremiereDates = releaseDates
    ?.filter((release) => release.type !== ReleaseDateType.Premiere)
    .sort(({ release_date: a }, { release_date: b }) =>
      compareDates(isoToUTC(a), isoToUTC(b)),
    );

  const date = sortedNonPremiereDates?.[0]?.release_date;

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
