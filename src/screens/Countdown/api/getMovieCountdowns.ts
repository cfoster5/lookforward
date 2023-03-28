import { TmdbKey } from "constants/ApiKeys";
import { FirestoreMovie } from "interfaces/firebase";
import { useQueries } from "react-query";

import { isoToUTC } from "@/utils/dates";

async function getMovie(movieId: FirestoreMovie["documentID"]) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TmdbKey}&append_to_response=release_dates&language=en-US`
  );
  const json = await response.json();

  const usRelease = json.release_dates.results.find(
    (result) => result.iso_3166_1 === "US"
  );
  const filteredReleases = usRelease?.release_dates.filter(
    (release) => release.type !== 1
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
export function useMovieCountdowns(movieSubs) {
  return useQueries(
    movieSubs.map((sub) => {
      return {
        queryKey: ["movieSubs", sub.documentID],
        queryFn: () => getMovie(sub.documentID),
      };
    })
  );
}
