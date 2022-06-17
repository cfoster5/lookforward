import { useQueries } from "react-query";
import { DateTime } from "luxon";

import { TmdbKey } from "../../../constants/ApiKeys";
import { FirestoreMovie } from "../../../interfaces/firebase";

async function getMovie(movieId: FirestoreMovie["documentID"]) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TmdbKey}&append_to_response=release_dates&language=en-US`
  );
  const json = await response.json();

  let date = json.release_dates.results
    .find((result) => result.iso_3166_1 === "US")
    ?.release_dates.filter((release) => release.type !== 1)
    .sort(
      ({ release_date: a }, { release_date: b }) =>
        DateTime.fromISO(a) > DateTime.fromISO(b)
    )[0].release_date;

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
