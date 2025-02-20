import { useQueries } from "@tanstack/react-query";
import { ReleaseDateType } from "tmdb-ts";

import { FirestoreMovie } from "@/interfaces/firebase";
import { tmdb } from "@/providers/app";
import { compareDates, isoToUTC } from "@/utils/dates";
import { useStore } from "@/stores/store";

async function getMovie(movieId: FirestoreMovie["documentID"]) {
  const json = await tmdb.movies.details(
    Number(movieId),
    ["release_dates"],
    "en-US",
  );

  const usRelease = json.release_dates.results.find(
    (result) => result.iso_3166_1 === "US",
  );

  const nonPremiereDates = usRelease?.release_dates.filter(
    (release) => release.type !== ReleaseDateType.Premiere,
  );

  const sortedNonPremiereDates = nonPremiereDates?.sort(
    ({ release_date: a }, { release_date: b }) =>
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
  const { movieSubs } = useStore();
  return useQueries({
    queries: movieSubs.map((sub) => {
      return {
        queryKey: ["movieSubs", sub.documentID],
        queryFn: () => getMovie(sub.documentID),
      };
    }),
  });
}
