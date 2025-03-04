import { useQuery } from "@tanstack/react-query";
import { MovieDetails } from "tmdb-ts";

import { OMDBMovie } from "../types/omdb";

import { OMDB_KEY } from "@/constants/ApiKeys";
import { useStore } from "@/stores/store";

async function getOmdbMovie(id: MovieDetails["imdb_id"]) {
  const response = await fetch(
    `https://www.omdbapi.com/?apikey=${OMDB_KEY}&i=${id}`,
  );
  const json: OMDBMovie = await response.json();

  // return {
  //   ratings: json?.Ratings ?? [],
  //   boxOffice: json?.BoxOffice ?? null,
  // };
  return json;
}

export function useMovieRatings(id?: MovieDetails["imdb_id"]) {
  const { isPro } = useStore();
  return useQuery({
    queryKey: ["omdbMovie", id],
    queryFn: () => getOmdbMovie(id!),
    // Use `enabled` option here to make sure we only fetch the movie ratings if the user is a pro user and the movie id is provided.
    enabled: isPro && !!id,
    select: (data) => data.Ratings ?? [],
  });
}
