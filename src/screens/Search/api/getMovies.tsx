import { TmdbKey } from "constants/ApiKeys";
import {
  MoviesPlayingNow,
  PopularMovies,
  UpcomingMovies,
} from "interfaces/tmdb";
import { useInfiniteQuery } from "react-query";

import { MovieOption } from "../types";

async function getMovies({ pageParam = 1, queryKey }) {
  const { option, searchValue } = queryKey[1];
  const endpoints = {
    "Coming Soon": `https://api.themoviedb.org/3/movie/upcoming?api_key=${TmdbKey}&language=en-US&page=${pageParam}&region=US`,
    "Now Playing": `https://api.themoviedb.org/3/movie/now_playing?api_key=${TmdbKey}&language=en-US&page=${pageParam}&region=US`,
    Popular: `https://api.themoviedb.org/3/movie/popular?api_key=${TmdbKey}&language=en-US&page=${pageParam}&region=US`,
    Trending: `https://api.themoviedb.org/3/trending/movie/day?api_key=${TmdbKey}&page=${pageParam}`,
    Search: `https://api.themoviedb.org/3/search/multi?api_key=${TmdbKey}&language=en-US&query=${searchValue}&page=${pageParam}&include_adult=false&region=US`,
  };
  const response = await fetch(
    !searchValue ? endpoints[option] : endpoints.Search
  );
  const json: UpcomingMovies | MoviesPlayingNow | PopularMovies =
    await response.json();
  return json;
}

export function useMovieData(option: MovieOption, searchValue: string) {
  return useInfiniteQuery(
    [
      "movies",
      {
        option,
        searchValue,
      },
    ],
    getMovies,
    {
      getNextPageParam: (lastPage) =>
        lastPage.page !== lastPage.total_pages ? lastPage.page + 1 : undefined,
      // select: (movieData) => movieData.pages.flatMap((page) => page.results),
    }
  );
}
