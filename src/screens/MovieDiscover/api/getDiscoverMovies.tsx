import { useInfiniteQuery } from "@tanstack/react-query";

import { TMDB_KEY } from "@/constants/ApiKeys";
import { useAppConfigStore } from "@/stores/appConfig";

async function getMovies({ pageParam, queryKey }) {
  const params = queryKey[1];
  const { language, region } = queryKey[2];
  // Remove undefined params or watch_providers when set to 0
  const filteredParamsArrays = Object.entries(params).filter(
    (param) => param[1],
  );
  const queryString = filteredParamsArrays
    .map(([key, value]) => `&${key}=${value}`)
    .join("");
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}${queryString}&language=${language}-${region}&region=${region}&watch_region=${region}&page=${pageParam}`,
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
  const movieLanguage = useAppConfigStore((state) => state.movieLanguage);
  const movieRegion = useAppConfigStore((state) => state.movieRegion);

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
      { language: movieLanguage, region: movieRegion },
    ],
    queryFn: getMovies,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    select: (movieData) => movieData.pages.flatMap((page) => page.results),
  });
}
