import { useQuery } from "@tanstack/react-query";
import { MovieDetails } from "tmdb-ts";

import { OMDB_KEY } from "@/constants/ApiKeys";

import { OMDBMovie } from "../types/omdb";

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
  return useQuery({
    queryKey: ["omdbMovie", id],
    queryFn: () => getOmdbMovie(id!),
    enabled: !!id,
    select: (data) => data.Ratings ?? [],
  });
}
