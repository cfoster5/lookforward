import { DateTime } from "luxon";

import { TMDB } from "../interfaces/tmdb";
import { MovieWatchProvider } from "../interfaces/tmdb.old";

export async function getDiscoverMovies({
  genreId,
  companyId,
  keywordId,
  sortMethod,
  watchProvider,
  pageIndex,
}: {
  genreId?: number;
  companyId?: number;
  keywordId?: number;
  sortMethod: string;
  watchProvider: number;
  pageIndex?: number;
}) {
  console.log("pageIndex", pageIndex);
  let filter = "";
  filter += genreId ? `&with_genres=${genreId}` : ``;
  filter += companyId ? `&with_companies=${companyId}` : ``;
  filter += keywordId ? `&with_keywords=${keywordId}` : ``;
  if (watchProvider === 119) {
    // Using updated Amazon Prime id
    watchProvider = 9;
  }
  filter += watchProvider !== 0 ? `&with_watch_providers=${watchProvider}` : ``;

  console.log(`filter`, filter);

  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=68991fbb0b75dba5ae0ecd8182e967b1${filter}&region=US&watch_region=US&sort_by=${sortMethod}&page=${
      pageIndex ? pageIndex : 1
    }`
  );
  return await response.json();
}
