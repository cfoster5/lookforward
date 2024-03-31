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

import { TMDB_KEY } from "@/constants/ApiKeys";

interface MyInterface extends MovieDetails {
  credits: Credits;
  videos: Videos;
  keywords: Keywords;
  recommendations: Recommendations;
  images: Images;
  "watch/providers": WatchProviders;
  release_dates: ReleaseDates;
}

async function getMovie(movieId: number) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_KEY}&append_to_response=credits,videos,keywords,recommendations,images,watch/providers,release_dates&include_image_language=en,null,`
  );
  const json: MyInterface = await response.json();

  return json;
}

export function useMovie(movieId: number) {
  return useQuery(["movie", movieId], () => getMovie(movieId));
}
