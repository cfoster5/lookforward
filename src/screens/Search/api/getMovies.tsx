import { useInfiniteQuery } from "@tanstack/react-query";
import { DateTime } from "luxon";

import { tmdb } from "@/providers/app";
import { now } from "@/utils/dates";

import { MovieOption } from "../types";

type GetMoviesParams = {
  pageParam: number;
  option: MovieOption;
};

async function getMovies({ pageParam, option }: GetMoviesParams) {
  const options = {
    language: "en-US",
    page: pageParam,
  };

  const endpoints = {
    [MovieOption.ComingSoon]: tmdb.movies.upcoming({
      ...options,
      region: "US",
    }),
    [MovieOption.NowPlaying]: tmdb.movies.nowPlaying({
      ...options,
      region: "US",
    }),
    [MovieOption.Popular]: tmdb.movies.popular({
      ...options,
    }),
    [MovieOption.Trending]: tmdb.trending.trending("movie", "day", {
      ...options,
    }),
  };

  return await endpoints[option];
}

export function useMovieData(option: MovieOption) {
  return useInfiniteQuery({
    queryKey: ["movies", option],
    queryFn: ({ pageParam }) => getMovies({ pageParam, option }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    select: (data) => {
      const movies = data.pages.flatMap((page) => page.results);
      // Upcoming endpoint contains re-releases, especially for Theatrical (limited) / Type 2; Filter these out
      return option === MovieOption.ComingSoon
        ? movies.filter(
            (movie) =>
              movie.release_date &&
              DateTime.fromFormat(movie.release_date, "yyyy-MM-dd") >= now,
          )
        : movies;
    },
  });
}
