import { IGDB, TMDB } from '../types';

// export async function getGames(): Promise<IGDB.Game[]> {
//   const response = await fetch("https://37y5ky2qx5.execute-api.us-east-1.amazonaws.com/games", {
//     method: 'POST',
//     headers: {
//       'user-key': "8ee8062725cb2dc2a465c8b304954582"
//     },
//     body: `fields name, summary, cover.*, release_dates.*, release_dates.platform.*, genres.name; where release_dates.date > ${Math.floor(Date.now() / 1000)}; limit 50;`
//   });
//   return response.json();
// }

// export async function getGameReleases(): Promise<IGDB.ReleaseDate[]> {
//   const response = await fetch("https://37y5ky2qx5.execute-api.us-east-1.amazonaws.com/release_dates", {
//     method: 'POST',
//     headers: {
//       'user-key': "8ee8062725cb2dc2a465c8b304954582"
//     },
//     body: `fields *, game.name, game.summary, game.cover.*, game.genres.name, platform.abbreviation, platform.name; where date > ${Math.floor(Date.now() / 1000)}; limit 50; sort date;`
//   });
//   return response.json();
// }

export async function getUpcomingGameReleases(): Promise<IGDB.ReleaseDate.ReleaseDate[]> {
  const response = await fetch("https://api.igdb.com/v4/release_dates", {
    method: 'POST',
    headers: {
      "Client-ID": "lj3tlp1tz4vmha6gousdpge7x12s5m",
      Authorization: "Bearer jkq3s91dk0l5w1tb43vo7d2kdxe79x"
    },
    body: `fields *, game.name, game.summary, game.cover.*, game.genres.name, game.videos.name, game.videos.video_id, game.involved_companies.developer, game.involved_companies.porting, game.involved_companies.publisher, game.involved_companies.supporting, game.involved_companies.company.name, platform.abbreviation, platform.name; where date > ${Math.floor(Date.now() / 1000)} & region = (2,8); limit 100; sort date;`
  });
  return response.json();
}

// export async function getGameDetails(gameId: number): Promise<IGDB.Game.Game> {
//   const response = await fetch("https://api.igdb.com/v4/games", {
//     method: 'POST',
//     headers: {
//       "Client-ID": "lj3tlp1tz4vmha6gousdpge7x12s5m",
//       Authorization: "Bearer jkq3s91dk0l5w1tb43vo7d2kdxe79x"
//     },
//     body: `fields videos.name, videos.video_id, similar_games.*; where id = ${gameId};`
//   });
//   const games: IGDB.Game.Game[] = await response.json();
//   return games[0];
// }

// export async function getUpcomingGames(): Promise<IGDB.Game.Game[]> {
//   const response = await fetch("https://api.igdb.com/v4/games", {
//     method: 'POST',
//     headers: {
//       "Client-ID": "lj3tlp1tz4vmha6gousdpge7x12s5m",
//       Authorization: "Bearer jkq3s91dk0l5w1tb43vo7d2kdxe79x"
//     },
//     body: `fields name, summary, cover.*, release_dates.*, release_dates.platform.abbreviation, release_dates.platform.name, genres.name; where release_dates.date > ${Math.floor(Date.now() / 1000)}; limit 50; sort date;`
//   });
//   return response.json();
// }

export async function searchGames(searchVal: string): Promise<IGDB.Game.Game[]> {
  const response = await fetch("https://api.igdb.com/v4/games", {
    method: 'POST',
    headers: {
      "Client-ID": "lj3tlp1tz4vmha6gousdpge7x12s5m",
      Authorization: "Bearer jkq3s91dk0l5w1tb43vo7d2kdxe79x"
    },
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

export async function getMovieCredits(person: number): Promise<TMDB.Person.Credits> {
  const response = await fetch(`https://api.themoviedb.org/3/person/${person}/movie_credits?api_key=68991fbb0b75dba5ae0ecd8182e967b1&language=en-US`);
  return response.json();
}
