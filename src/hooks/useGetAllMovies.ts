import { useEffect, useState } from "react";
import { DateTime } from "luxon";

import { FirestoreMovie } from "../interfaces/firebase";
import { MovieDetails, ReleaseDates } from "../interfaces/tmdb/movies";
import { ExtendedMovie } from "../interfaces/trakt/index";

interface MyInterface extends MovieDetails {
  documentID: FirestoreMovie["documentID"];
  traktReleaseDate: ExtendedMovie["released"];
}

export function useGetAllMovies(movieSubs: FirestoreMovie[]) {
  const [state, setState] = useState<{
    movies: MyInterface[];
    loading: boolean;
  }>({
    movies: [],
    loading: true,
  });

  useEffect(() => {
    async function getAllMovies() {
      async function getMovie(movieId: FirestoreMovie["documentID"]) {
        // Get imdb_id based on tmdb_id
        const tmdbResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=68991fbb0b75dba5ae0ecd8182e967b1&append_to_response=release_dates&language=en-US`
        );
        const tmdbJson: MovieDetails & { release_dates: ReleaseDates } =
          await tmdbResponse.json();

        console.log(DateTime.fromFormat(tmdbJson.release_date, "yyyy-MM-dd"));

        let date = tmdbJson.release_dates.results
          .find((result) => result.iso_3166_1 === "US")
          ?.release_dates.filter((release) => release.type !== 1)
          .sort(
            ({ release_date: a }, { release_date: b }) =>
              DateTime.fromISO(a) > DateTime.fromISO(b)
          )[0].release_date;

        console.log("date", date, tmdbJson.release_date);

        return {
          ...tmdbJson,
          // traktReleaseDate: traktJson.released,
          releaseDate: date,
          documentID: movieId,
        };
      }
      const movies = await Promise.all(
        movieSubs.map((sub) => getMovie(sub.documentID))
      );
      setState({ movies: movies, loading: false });
    }
    getAllMovies();
  }, [movieSubs]);

  return state;
}
