import { game, release, TMDB } from '../types';

export async function getGames(): Promise<game[]> {
  const response = await fetch("https://37y5ky2qx5.execute-api.us-east-1.amazonaws.com/games", {
    method: 'POST',
    headers: {
      'user-key': "8ee8062725cb2dc2a465c8b304954582"
    },
    body: `fields name, summary, cover.*, release_dates.*, release_dates.platform.*, genres.name; where release_dates.date > ${Math.floor(Date.now() / 1000)}; limit 50;`
  });
  return response.json();
}

export async function getGameReleases(): Promise<release[]> {
  const response = await fetch("https://37y5ky2qx5.execute-api.us-east-1.amazonaws.com/release_dates", {
    method: 'POST',
    headers: {
      'user-key': "8ee8062725cb2dc2a465c8b304954582"
    },
    body: `fields *, game.name, game.summary, game.cover.*, game.genres.name, platform.abbreviation, platform.name; where date > ${Math.floor(Date.now() / 1000)}; limit 50; sort date;`
  });
  return response.json();
}

export async function getGamesSearch(searchVal: string): Promise<game[]> {
  const response = await fetch("https://37y5ky2qx5.execute-api.us-east-1.amazonaws.com/games", {
    method: 'POST',
    headers: {
      'user-key': "8ee8062725cb2dc2a465c8b304954582"
    },
    body: `fields name, summary, cover.*, release_dates.*, release_dates.platform.*, genres.name; where release_dates.date > ${Math.floor(Date.now() / 1000)}; search "${searchVal}"; limit 50;`
  });
  return response.json();
}

export async function getUpcomingMovies() {
  const response = await fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=68991fbb0b75dba5ae0ecd8182e967b1&language=en-US&region=US&include_adult=false&page=1`);
  const json: TMDB.Movie.Response = await response.json();
  return json.results.sort((a, b) => {
    return b.popularity - a.popularity;
  });
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

export async function getMovieCredits(person: number): Promise<TMDB.Person.Credits> {
  const response = await fetch(`https://api.themoviedb.org/3/person/${person}/movie_credits?api_key=68991fbb0b75dba5ae0ecd8182e967b1&language=en-US`);
  return response.json();
}
