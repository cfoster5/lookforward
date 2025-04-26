import { useInfiniteQuery } from "@tanstack/react-query";

import { TMDB_KEY } from "@/constants/ApiKeys";

async function getMovies({ pageParam, queryKey }) {
  const [{ ...params }] = queryKey;
  // Remove undefined params or watch_providers when set to 0
  const filteredParamsArrays = Object.entries(params).filter(
    (param) => param[1],
  );
  const queryString = filteredParamsArrays
    .map(([key, value]) => `&${key}=${value}`)
    .join("");
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}${queryString}&region=US&watch_region=US&page=${pageParam}`,
  );
  const json = await response.json();
  return {
    ...json,
    nextPage: json.page !== json.total_pages ? json.page + 1 : undefined,
  };
}

export function useDiscoverMovies({
  genreId,
  companyId,
  keywordId,
  sortMethod,
  watchProvider,
}: {
  genreId?: number;
  companyId?: number;
  keywordId?: number;
  sortMethod: string;
  watchProvider: number;
}) {
  if (watchProvider === 119) {
    // Using updated Amazon Prime id
    watchProvider = 9;
  }

  return useInfiniteQuery({
    queryKey: [
      "discoverMovies",
      {
        with_genres: genreId,
        with_companies: companyId,
        with_keywords: keywordId,
        with_watch_providers: watchProvider,
        sort_by: sortMethod,
      },
    ],
    queryFn: getMovies,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    select: (movieData) => movieData.pages.flatMap((page) => page.results),
  });
}
