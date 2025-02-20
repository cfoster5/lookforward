import { useQuery } from "@tanstack/react-query";
import { TrendingResults } from "tmdb-ts";

import { TMDB_KEY } from "@/constants/ApiKeys";

async function getMovies() {
  const response = await fetch(
    `https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_KEY}`,
  );
  const json: TrendingResults<"movie"> = await response.json();
  return json;
}

export function useTrendingMovies() {
  return useQuery({
    queryKey: ["trendingMovies"],
    queryFn: getMovies,
    select: (moviesData) => moviesData.results,
  });
}
