import { useEffect, useState } from "react";

import { FirestoreMovie } from "../interfaces/firebase";
import { MovieDetails } from "../interfaces/tmdb/movies";
import { ExtendedMovie } from "../interfaces/trakt/index";

interface MyInterface extends MovieDetails {
  traktReleaseDate: ExtendedMovie["released"];
  documentID: FirestoreMovie["documentID"];
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
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=68991fbb0b75dba5ae0ecd8182e967b1&language=en-US`
        );
        const tmdbJson: MovieDetails = await tmdbResponse.json();

        // Get release date from trakt based on imdb_id
        const traktResponse = await fetch(
          `https://api.trakt.tv/movies/${tmdbJson.imdb_id}?extended=full`,
          {
            headers: {
              "trakt-api-key":
                "8c5d0879072bf8414e5d6963e9a4c3bfc69b24db9ac28f1c664ff0431d2e31bb",
            },
          }
        );
        const traktJson: ExtendedMovie = await traktResponse.json();

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
