import { useInfiniteQuery } from "@tanstack/react-query";
import {
  MoviesPlayingNow,
  PopularMovies,
  TrendingResults,
  UpcomingMovies,
} from "tmdb-ts";

import { MovieOption } from "../types";

import { TMDB_KEY } from "@/constants/ApiKeys";

async function getMovies({
  pageParam = 1,
  option,
}: {
  pageParam: number;
  option: MovieOption;
}) {
  const endpoints = {
    [MovieOption.ComingSoon]: `https://api.themoviedb.org/3/movie/upcoming?api_key=${TMDB_KEY}&language=en-US&page=${pageParam}&region=US`,
    [MovieOption.NowPlaying]: `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_KEY}&language=en-US&page=${pageParam}&region=US`,
    [MovieOption.Popular]: `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_KEY}&language=en-US&page=${pageParam}&region=US`,
    [MovieOption.Trending]: `https://api.themoviedb.org/3/trending/movie/day?api_key=${TMDB_KEY}&page=${pageParam}`,
  };
  const response = await fetch(endpoints[option]);
  const json:
    | UpcomingMovies
    | MoviesPlayingNow
    | PopularMovies
    | TrendingResults<"movie"> = await response.json();
  return json;
}

export function useMovieData(option: MovieOption) {
  return useInfiniteQuery(
    ["movies", { option }],
    ({ pageParam }) => getMovies({ pageParam, option }),
    {
      getNextPageParam: (lastPage) =>
        lastPage.page !== lastPage.total_pages ? lastPage.page + 1 : undefined,
      // select: (movieData) => movieData.pages.flatMap((page) => page.results),
    },
  );
}
