import { DateTime } from "luxon";
import { PosterSizes } from "tmdb-ts";

import {
  formatGameReleaseDate,
  isoToUTC,
  now,
  timestampToUTC,
} from "@/utils/dates";

import { useGameCountdowns } from "../api/getGameCountdowns";
import { useMovieCountdowns } from "../api/getMovieCountdowns";

type MovieCountdown = ReturnType<typeof useMovieCountdowns>[number]["data"];
type GameCountdown = ReturnType<typeof useGameCountdowns>[number]["data"];
type CountdownItem = MovieCountdown | GameCountdown;

export function getImageSource(
  item: CountdownItem,
  sectionName: "Movies" | "Games",
): string {
  if (sectionName === "Movies") {
    const movieItem = item as MovieCountdown;
    return `https://image.tmdb.org/t/p/${PosterSizes.W300}${movieItem.poster_path}`;
  }

  const gameItem = item as GameCountdown;
  return `https:${gameItem.game.cover?.url.replace("thumb", "cover_big_2x")}`;
}

export function getTitle(
  item: CountdownItem,
  sectionName: "Movies" | "Games",
): string {
  if (sectionName === "Movies") {
    return (item as MovieCountdown).title;
  }

  return (item as GameCountdown).game.name;
}

export function formatReleaseDate(
  item: CountdownItem,
  sectionName: "Movies" | "Games",
): string {
  if (sectionName === "Movies") {
    const movieItem = item as MovieCountdown;
    return movieItem.releaseDate
      ? isoToUTC(movieItem.releaseDate).toLocaleString(DateTime.DATE_MED)
      : "TBD";
  }

  const gameItem = item as GameCountdown;
  return formatGameReleaseDate(gameItem.date, gameItem.human);
}

export function calculateDaysUntil(
  item: CountdownItem,
  sectionName: "Movies" | "Games",
): number | null {
  if (sectionName === "Movies") {
    const movieItem = item as MovieCountdown;
    if (!movieItem.releaseDate) return null;
    return Math.ceil(isoToUTC(movieItem.releaseDate).diff(now).as("days"));
  }

  const gameItem = item as GameCountdown;
  if (!gameItem.date) return null;
  return Math.ceil(timestampToUTC(gameItem.date).diff(now).as("days"));
}

export function getDocumentId(
  item: CountdownItem,
  sectionName: "Movies" | "Games",
): string {
  if (sectionName === "Movies") {
    return (item as MovieCountdown).documentID;
  }

  return (item as GameCountdown).id.toString();
}

export function getAspectRatio(sectionName: "Movies" | "Games"): number {
  return sectionName === "Movies" ? 2 / 3 : 3 / 4;
}
