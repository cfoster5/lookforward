import { useInfiniteQuery } from "@tanstack/react-query";

import { TMDB_KEY } from "@/constants/ApiKeys";
import { useAppConfigStore } from "@/stores/appConfig";

async function getMovies({ pageParam, queryKey }) {
  const params = queryKey[1];
  const { language, region } = queryKey[2];
  // Remove undefined/null params or watch_providers when set to 0
  const filteredParamsArrays = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== null && value !== 0,
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
  primaryReleaseDateGte,
  language,
  region,
  includeAdult,
  includeVideo,
  withOriginalLanguage,
}: {
  genreId?: number;
  companyId?: number;
  keywordId?: number;
  sortMethod: string;
  watchProvider: number;
  primaryReleaseDateGte?: string;
  language?: string;
  region?: string;
  includeAdult?: boolean;
  includeVideo?: boolean;
  withOriginalLanguage?: string;
}) {
  const storeLanguage = useAppConfigStore((state) => state.movieLanguage);
  const storeRegion = useAppConfigStore((state) => state.movieRegion);
  const movieLanguage = language ?? storeLanguage;
  const movieRegion = region ?? storeRegion;

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
        "primary_release_date.gte": primaryReleaseDateGte,
        include_adult: includeAdult,
        include_video: includeVideo,
        with_original_language: withOriginalLanguage,
      },
      { language: movieLanguage, region: movieRegion },
    ],
    queryFn: getMovies,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    select: (movieData) => movieData.pages.flatMap((page) => page.results),
  });
}
