import { TMDB } from '../interfaces/tmdb';

export async function getUpcomingMovies(pageIndex?: number) {
  const response = await fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=68991fbb0b75dba5ae0ecd8182e967b1&language=en-US&region=US&include_adult=false&page=${pageIndex ? pageIndex : 1}`);
  const json: TMDB.Response = await response.json();
  // return json.results.sort((a, b) => {
  //   return b.popularity - a.popularity;
  // });
  return json;
}

// export async function searchMovies(searchVal: string) {
// const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=68991fbb0b75dba5ae0ecd8182e967b1&language=en-US&region=US&include_adult=false&page=1&query=${searchVal}`);
export async function searchMovies(searchVal: string, pageIndex?: number) {
  const response = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=68991fbb0b75dba5ae0ecd8182e967b1&language=en-US&region=US&include_adult=false&page=${pageIndex ? pageIndex : 1}&query=${searchVal}`);
  const json: TMDB.Response = await response.json();
  // return json.results.sort((a, b) => {
  //   return b.popularity - a.popularity;
  // });
  return json;
}

export async function getMovieDetails(movieId: number): Promise<TMDB.Movie.DetailsExtended> {
  const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=68991fbb0b75dba5ae0ecd8182e967b1&language=en-US&append_to_response=credits,similar,videos,release_dates,keywords,recommendations`);
  return response.json();
}

// export async function getMovieCredits(person: number): Promise<TMDB.MovieCredits.Credits> {
//   const response = await fetch(`https://api.themoviedb.org/3/person/${person}/movie_credits?api_key=68991fbb0b75dba5ae0ecd8182e967b1&language=en-US`);
//   return response.json();
// }
export async function getPerson(personId: number): Promise<TMDB.Person> {
  const response = await fetch(`https://api.themoviedb.org/3/person/${personId}?api_key=68991fbb0b75dba5ae0ecd8182e967b1&language=en-US&append_to_response=movie_credits,images`);
  return response.json();
}

export async function getTrendingMovies(pageIndex?: number) {
  const response = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=68991fbb0b75dba5ae0ecd8182e967b1&page=${pageIndex ? pageIndex : 1}`);
  const json: TMDB.Response = await response.json();
  return json;
}

export async function getNowPlayingMovies(pageIndex?: number) {
  const response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=68991fbb0b75dba5ae0ecd8182e967b1&region=US&page=${pageIndex ? pageIndex : 1}`);
  const json: TMDB.Response = await response.json();
  return json;
}

export async function getPopularMovies(pageIndex?: number) {
  const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=68991fbb0b75dba5ae0ecd8182e967b1&region=US&page=${pageIndex ? pageIndex : 1}`);
  const json: TMDB.Response = await response.json();
  return json;
}

// export async function getTopRatedMovies(): Promise<TMDB.Movie.Movie[]> {
//   const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=68991fbb0b75dba5ae0ecd8182e967b1&region=US`);
//   const json: TMDB.Response = await response.json();
//   return json.results;
// }

export async function getPopularPeople(): Promise<any[]> {
  const response = await fetch(`https://api.themoviedb.org/3/person/popular?api_key=68991fbb0b75dba5ae0ecd8182e967b1`);
  const json: TMDB.Response = await response.json();
  return json.results;
}

export async function getDiscoverMovies({ genreId, companyId, keywordId, sortMethod, watchProvider, pageIndex }: { genreId?: number, companyId?: number, keywordId?: number, sortMethod: string, watchProvider: number, pageIndex?: number }) {
  let filter = "";
  filter += genreId ? `&with_genres=${genreId}` : ``;
  filter += companyId ? `&with_companies=${companyId}` : ``;
  filter += keywordId ? `&with_keywords=${keywordId}` : ``;
  if (watchProvider === 119) {
    // Using updated Amazon Prime id
    watchProvider = 9;
  }
  filter += watchProvider !== 0 ? `&with_watch_providers=${watchProvider}` : ``;

  console.log(`filter`, filter)

  const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=68991fbb0b75dba5ae0ecd8182e967b1${filter}&region=US&watch_region=US&sort_by=${sortMethod}&page=${pageIndex ? pageIndex : 1}`);
  const json: TMDB.Response = await response.json();
  // return json.results;
  return json;
}

export async function getMovieWatchProviders() {
  const response = await fetch(`https://api.themoviedb.org/3/watch/providers/movie?api_key=68991fbb0b75dba5ae0ecd8182e967b1&language=en-US&watch_region=US`)
  return await response.json();
}
