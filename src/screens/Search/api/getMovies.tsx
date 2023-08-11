import { TMDB_KEY } from "@/constants/ApiKeys";
import {
  MoviesPlayingNow,
  PopularMovies,
  UpcomingMovies,
} from "interfaces/tmdb";
import { useInfiniteQuery } from "react-query";

import { MovieOption } from "../types";

import { MultiSearch } from "@/types";

async function getMovies({
  pageParam = 1,
  option,
  searchValue,
}: {
  pageParam: number;
  option: MovieOption;
  searchValue?: string;
}) {
  // const { option, searchValue }: { option: MovieOption; searchValue?: string } =
  //   queryKey[1];
  const endpoints = {
    [MovieOption.ComingSoon]: `https://api.themoviedb.org/3/movie/upcoming?api_key=${TMDB_KEY}&language=en-US&page=${pageParam}&region=US`,
    [MovieOption.NowPlaying]: `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_KEY}&language=en-US&page=${pageParam}&region=US`,
    [MovieOption.Popular]: `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_KEY}&language=en-US&page=${pageParam}&region=US`,
    [MovieOption.Trending]: `https://api.themoviedb.org/3/trending/movie/day?api_key=${TMDB_KEY}&page=${pageParam}`,
    Search: `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_KEY}&language=en-US&query=${searchValue}&page=${pageParam}&include_adult=false&region=US`,
  };
  const response = await fetch(
    !searchValue ? endpoints[option] : endpoints.Search
  );
  const json: UpcomingMovies | MoviesPlayingNow | PopularMovies | MultiSearch =
    await response.json();
  return json;
}

export function useMovieData(option: MovieOption, searchValue: string) {
  return useInfiniteQuery(
    ["movies", { option, searchValue }],
    ({ pageParam }) => getMovies({ pageParam, option, searchValue }),
    {
      getNextPageParam: (lastPage) =>
        lastPage.page !== lastPage.total_pages ? lastPage.page + 1 : undefined,
      // select: (movieData) => movieData.pages.flatMap((page) => page.results),
    }
  );
}
