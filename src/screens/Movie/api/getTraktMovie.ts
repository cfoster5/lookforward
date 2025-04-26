import { useQuery } from "@tanstack/react-query";
import { MovieDetails } from "tmdb-ts";

import { TRAKT_KEY } from "@/constants/ApiKeys";
import { ExtendedMovie } from "@/interfaces/trakt";

async function getTraktMovie(id: MovieDetails["imdb_id"]) {
  const traktResponse = await fetch(
    `https://api.trakt.tv/movies/${id}?extended=full`,
    {
      headers: {
        "trakt-api-key": TRAKT_KEY,
      },
    },
  );
  const json: ExtendedMovie = await traktResponse.json();

  return json;
}

export function useTraktMovie(id?: MovieDetails["imdb_id"]) {
  return useQuery({
    queryKey: ["traktMovie", id],
    queryFn: () => getTraktMovie(id!),
    enabled: !!id,
  });
}
