import moment from 'moment';
import { IGDB, TMDB } from '../../types';

export async function getUpcomingGameReleases(): Promise<IGDB.ReleaseDate.ReleaseDate[]> {
  const response = await fetch("https://gou4rcsh6i.execute-api.us-east-1.amazonaws.com/prod/release_dates", {
    method: 'POST',
    body: `fields *, game.name, game.summary, game.cover.*, game.genres.name, game.videos.name, game.videos.video_id, game.involved_companies.developer, game.involved_companies.porting, game.involved_companies.publisher, game.involved_companies.supporting, game.involved_companies.company.name, platform.abbreviation, platform.name; where date > ${Math.floor(Date.now() / 1000)} & region = (2,8); limit 100; sort date;`
  });
  return response.json();
}

export async function searchGames(searchVal: string): Promise<IGDB.Game.Game[]> {
  const response = await fetch("https://gou4rcsh6i.execute-api.us-east-1.amazonaws.com/prod/games", {
    method: 'POST',
    body: `fields name, summary, cover.*, release_dates.*, release_dates.platform.abbreviation, release_dates.platform.name, genres.name, videos.name, videos.video_id, involved_companies.developer, involved_companies.porting, involved_companies.publisher, involved_companies.supporting, involved_companies.company.name; where release_dates.date > ${Math.floor(Date.now() / 1000)} & release_dates.region = (2,8); search "${searchVal}"; limit 50;`
  });
  return response.json();
}

export async function getUpcomingMovies(): Promise<TMDB.Movie.Movie[]> {
  const response = await fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=68991fbb0b75dba5ae0ecd8182e967b1&language=en-US&region=US&include_adult=false&page=1`);
  const json: TMDB.Movie.Response = await response.json();
  // return json.results.sort((a, b) => {
  //   return b.popularity - a.popularity;
  // });
  return json.results
}

// export async function searchMovies(searchVal: string) {
// const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=68991fbb0b75dba5ae0ecd8182e967b1&language=en-US&region=US&include_adult=false&page=1&query=${searchVal}`);
export async function searchMovies(searchVal: string, year: number) {
  const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=68991fbb0b75dba5ae0ecd8182e967b1&language=en-US&region=US&include_adult=false&page=1&query=${searchVal}&primary_release_year=${year}`);
  const json: TMDB.Movie.Response = await response.json();
  return json.results.sort((a, b) => {
    return b.popularity - a.popularity;
  });
}

export async function getMovieDetails(movieId: number): Promise<TMDB.Movie.Details> {
  const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=68991fbb0b75dba5ae0ecd8182e967b1&language=en-US&append_to_response=credits,similar,videos,release_dates`);
  return response.json();
}

export async function getMovieCredits(person: number): Promise<TMDB.MovieCredits.Credits> {
  const response = await fetch(`https://api.themoviedb.org/3/person/${person}/movie_credits?api_key=68991fbb0b75dba5ae0ecd8182e967b1&language=en-US`);
  return response.json();
}

export async function getTrendingMovies(): Promise<TMDB.Movie.Movie[]> {
  const response = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=68991fbb0b75dba5ae0ecd8182e967b1`);
  const json: TMDB.Movie.Response = await response.json();
  return json.results;
}

export async function getHypedGames(): Promise<IGDB.Game.Game[]> {
  const response = await fetch("https://gou4rcsh6i.execute-api.us-east-1.amazonaws.com/prod/games", {
    method: 'POST',
    body: `fields name, category, hypes, first_release_date, cover.*, release_dates.*; where category = 0 & first_release_date > ${Math.floor(Date.now() / 1000)} & release_dates.region = (2,8) & hypes != null & cover.url != null; sort hypes desc; limit 10;`
  });
  return response.json();
}

export async function getDiscoverMovies(genreId: number): Promise<TMDB.Movie.Movie[]> {
  const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=68991fbb0b75dba5ae0ecd8182e967b1&with_genres=${genreId}&region=US&primary_release_date.gte=${moment()}&sort_by=primary_release_date.asc`);
  const json: TMDB.Movie.Response = await response.json();
  return json.results;
}
