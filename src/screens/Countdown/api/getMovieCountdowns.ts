import { useQueries } from "react-query";
import { ReleaseDateType } from "tmdb-ts";

import { getReleaseDatesByCountry } from "@/helpers/getReleaseDatesByCountry";
import { FirestoreMovie } from "@/interfaces/firebase";
import { tmdb } from "@/providers/app";
import { useStore } from "@/stores/store";
import { compareDates, isoToUTC } from "@/utils/dates";

async function getMovie(movieId: FirestoreMovie["documentID"]) {
  const json = await tmdb.movies.details(
    Number(movieId),
    ["release_dates"],
    "en-US",
  );

  const usReleaseDates = getReleaseDatesByCountry(json.release_dates, "US");

  const sortedNonPremiereDates = usReleaseDates
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
  const { movieSubs } = useStore();
  return useQueries(
    movieSubs.map((sub) => {
      return {
        queryKey: ["movieSubs", sub.documentID],
        queryFn: () => getMovie(sub.documentID),
      };
    }),
  );
}
