import { useQuery } from "react-query";
import { TMDB_KEY } from "@/constants/ApiKeys";

async function getMovies() {
  const response = await fetch(
    `https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_KEY}`
  );
  const json = await response.json();
  return json;
}

export function useTrendingMovies() {
  return useQuery(["trendingMovies"], getMovies, {
    select: (moviesData) => moviesData.results,
  });
}
