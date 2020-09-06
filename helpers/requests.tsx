import moment from 'moment';
import { game, release } from '../types';

export async function getGames(): Promise<game[]> {
  const response = await fetch("https://37y5ky2qx5.execute-api.us-east-1.amazonaws.com/games", {
    method: 'POST',
    headers: {
      'user-key': "8ee8062725cb2dc2a465c8b304954582"
    },
    body: `fields name, summary, cover.*, release_dates.*, release_dates.platform.*, genres.name; where release_dates.date > ${moment().unix()}; limit 50;`
  });
  return response.json();
}

export async function getGameReleases(): Promise<release[]> {
  const response = await fetch("https://37y5ky2qx5.execute-api.us-east-1.amazonaws.com/release_dates", {
    method: 'POST',
    headers: {
      'user-key': "8ee8062725cb2dc2a465c8b304954582"
    },
    body: `fields *, game.name, game.summary, game.cover.*, game.genres.name, platform.abbreviation, platform.name; where date > ${moment().unix()}; limit 50; sort date;`
  });
  return response.json();
}

export async function getGamesSearch(searchVal: string): Promise<game[]> {
  const response = await fetch("https://37y5ky2qx5.execute-api.us-east-1.amazonaws.com/games", {
    method: 'POST',
    headers: {
      'user-key': "8ee8062725cb2dc2a465c8b304954582"
    },
    body: `fields name, summary, cover.*, release_dates.*, release_dates.platform.*, genres.name; where release_dates.date > ${moment().unix()}; search "${searchVal}"; limit 50;`
  });
  return response.json();
}
