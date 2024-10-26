import { useQueries } from "react-query";
import { ReleaseDateType } from "tmdb-ts";

import { FirestoreMovie } from "@/interfaces/firebase";
import { tmdb } from "@/providers/app";
import { isoToUTC } from "@/utils/dates";
import { useStore } from "@/stores/store";

async function getMovie(movieId: FirestoreMovie["documentID"]) {
  const json = await tmdb.movies.details(
    Number(movieId),
    ["release_dates"],
    "en-US"
  );

  const usRelease = json.release_dates.results.find(
    (result) => result.iso_3166_1 === "US"
  );
  const filteredReleases = usRelease?.release_dates.filter(
    (release) => release.type !== ReleaseDateType.Premiere
  );
  const sortedReleases = filteredReleases?.sort(
    (a, b) => isoToUTC(a.release_date) > isoToUTC(b.release_date)
  );
  const date = sortedReleases?.[0]?.release_date;

  return {
    ...json,
    // traktReleaseDate: traktJson.released,
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
