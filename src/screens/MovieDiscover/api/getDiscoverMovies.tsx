import { useInfiniteQuery } from "react-query";
import { TMDB_KEY } from "@/constants/ApiKeys";
import {
  MoviesPlayingNow,
  PopularMovies,
  UpcomingMovies,
} from "interfaces/tmdb";

async function getMovies({ pageParam = 1, queryKey }) {
  const { filter, sortMethod } = queryKey[1];
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}${filter}&region=US&watch_region=US&sort_by=${sortMethod}&page=${pageParam}`
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
  let filter = "";
  filter += genreId ? `&with_genres=${genreId}` : ``;
  filter += companyId ? `&with_companies=${companyId}` : ``;
  filter += keywordId ? `&with_keywords=${keywordId}` : ``;
  if (watchProvider === 119) {
    // Using updated Amazon Prime id
    watchProvider = 9;
  }
  filter += watchProvider !== 0 ? `&with_watch_providers=${watchProvider}` : ``;

  return useInfiniteQuery(
    ["discoverMovies", { filter: filter, sortMethod: sortMethod }],
    getMovies,
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
      select: (movieData) => movieData.pages.flatMap((page) => page.results),
      keepPreviousData: true,
    }
  );
}
