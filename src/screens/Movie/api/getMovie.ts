import { ExtendedMovie } from "interfaces/trakt";
import { useQuery } from "react-query";
import {
  Credits,
  Images,
  Keywords,
  MovieDetails,
  Recommendations,
  ReleaseDates,
  Videos,
  WatchProviders,
} from "tmdb-ts";

import { OMDBMovie } from "../types/omdb";

import { TMDB_KEY, OMDB_KEY } from "@/constants/ApiKeys";
import { useStore } from "@/stores/store";

interface MyInterface extends MovieDetails {
  credits: Credits;
  videos: Videos;
  keywords: Keywords;
  recommendations: Recommendations;
  images: Images;
  "watch/providers": WatchProviders;
  release_dates: ReleaseDates;
}

async function getMovie(movieId: number, isPro: boolean) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_KEY}&append_to_response=credits,videos,keywords,recommendations,images,watch/providers,release_dates&include_image_language=en,null,`
  );
  const tmdbJson: MyInterface = await response.json();

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

  const omdbResponse = isPro
    ? await fetch(
        `http://www.omdbapi.com/?apikey=${OMDB_KEY}&i=${tmdbJson.imdb_id}`
      )
    : null;
  const omdbData: OMDBMovie = await omdbResponse?.json();
  console.log("omdbData", omdbData);

  return {
    movieDetails: tmdbJson,
    traktDetails: traktJson,
    ratings: omdbData?.Ratings ?? [],
    boxOffice: omdbData?.BoxOffice ?? null,
  };
}

export function useMovie(movieId: number) {
  const { isPro } = useStore();
  return useQuery(["movie", movieId], () => getMovie(movieId, isPro));
}
