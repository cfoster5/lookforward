import { useEffect, useState } from "react";

import {
  Credits,
  Keywords,
  MovieDetails,
  Recommendations,
  Videos,
} from "../interfaces/tmdb";
import { ExtendedMovie } from "../interfaces/trakt/index";

interface MyInterface extends MovieDetails {
  credits: Credits;
  videos: Videos;
  keywords: Keywords;
  recommendations: Recommendations;
}

export function useGetMovie(movieId: number) {
  const [state, setState] = useState<{
    movieDetails?: MyInterface;
    traktDetails?: ExtendedMovie;
    loading: boolean;
  }>({
    movieDetails: undefined,
    traktDetails: undefined,
    loading: true,
  });

  useEffect(() => {
    async function getMovie() {
      const tmdbResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=68991fbb0b75dba5ae0ecd8182e967b1&language=en-US&append_to_response=credits,videos,keywords,recommendations`
      );
      const tmdbJson: MyInterface = await tmdbResponse.json();

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

      setState({
        movieDetails: tmdbJson,
        traktDetails: traktJson,
        loading: false,
      });
    }
    getMovie();
  }, [movieId]);

  return state;
}
