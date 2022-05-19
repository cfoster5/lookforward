import { useEffect, useState } from "react";

import { FirestoreMovie } from "../interfaces/firebase";
import { TMDB } from "../interfaces/tmdb";

export function useGetAllMovies(movieSubs: FirestoreMovie[]) {
  const [state, setState] = useState<{
    movies: TMDB.Movie.Details[];
    loading: boolean;
  }>({
    movies: [],
    loading: true,
  });

  useEffect(() => {
    async function getAllMovies() {
      async function getMovie(movieId: FirestoreMovie["documentID"]) {
        const tmdbResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=68991fbb0b75dba5ae0ecd8182e967b1&language=en-US&append_to_response=credits,similar,videos,release_dates,keywords,recommendations`
        );
        const tmdbJson = await tmdbResponse.json();

        const traktResponse = await fetch(
          `https://api.trakt.tv/movies/${tmdbJson.imdb_id}?extended=full`,
          {
            headers: {
              "trakt-api-key":
                "8c5d0879072bf8414e5d6963e9a4c3bfc69b24db9ac28f1c664ff0431d2e31bb",
            },
          }
        );
        const traktJson = await traktResponse.json();

        return {
          ...tmdbJson,
          traktReleaseDate: traktJson.released,
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
