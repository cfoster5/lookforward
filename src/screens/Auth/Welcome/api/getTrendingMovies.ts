import { useQuery } from "react-query";

import { TmdbKey } from "../../../../constants/ApiKeys";

async function getMovies() {
  const response = await fetch(
    `https://api.themoviedb.org/3/trending/movie/week?api_key=${TmdbKey}`
  );
  const json = await response.json();
  return json;
}

export function useTrendingMovies() {
  return useQuery(["trendingMovies"], getMovies, {
    select: (moviesData) => moviesData.results,
  });
}
