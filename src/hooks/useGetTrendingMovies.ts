import { useEffect, useState } from "react";

import { TmdbKey } from "../constants/ApiKeys";

export function useGetTrendingMovies(pageIndex?: number) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    async function getTrendingMovies() {
      const response = await fetch(
        `https://api.themoviedb.org/3/trending/movie/day?api_key=${TmdbKey}&page=${
          pageIndex ? pageIndex : 1
        }`
      );
      const json = await response.json();
      setMovies(json.results);
    }
    getTrendingMovies();
  }, []);

  return movies;
}
