import { useInfiniteQuery } from "@tanstack/react-query";
import { SortOption } from "tmdb-ts";

import { tmdb } from "@/providers/app";

type DiscoverMoviesQueryParams = {
  pageParam: number;
  queryKey: ["discoverMovies", MovieQueryOptions];
};

async function getMovies({ pageParam, queryKey }: DiscoverMoviesQueryParams) {
  const json = await tmdb.discover.movie({
    ...queryKey[1],
    region: "US",
    watch_region: "US",
    page: pageParam,
  });

  return {
    ...json,
    nextPage: json.page !== json.total_pages ? json.page + 1 : undefined,
  };
}

type MovieQueryOptions = {
  with_genres?: string;
  with_companies?: string;
  with_keywords?: string;
  with_watch_providers?: string;
  sort_by: SortOption;
};

export function useDiscoverMovies(queryOptions: MovieQueryOptions) {
  if (queryOptions.with_watch_providers === "119") {
    // Using updated Amazon Prime id
    queryOptions.with_watch_providers = "9";
  }

  const filteredQueryOptions = Object.fromEntries(
    // // Remove undefined params or with_watch_providers when set to 0
    Object.entries(queryOptions).filter(([key, value]) => value),
  );

  return useInfiniteQuery({
    queryKey: ["discoverMovies", filteredQueryOptions],
    queryFn: getMovies,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    select: (movieData) => movieData.pages.flatMap((page) => page.results),
  });
}
