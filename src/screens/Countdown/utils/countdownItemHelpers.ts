import { DateTime } from "luxon";
import { PosterSize } from "tmdb-ts";

import { formatGameReleaseDate, isoToUTC, timestampToUTC } from "@/utils/dates";

import { useGameCountdowns } from "../api/getGameCountdowns";
import { useMovieCountdowns } from "../api/getMovieCountdowns";
import { PersonCountdownData } from "../api/getPersonCountdowns";

type MovieCountdown = ReturnType<typeof useMovieCountdowns>[number]["data"];
type GameCountdown = ReturnType<typeof useGameCountdowns>[number]["data"];
type CountdownItem = MovieCountdown | GameCountdown | PersonCountdownData;

export type SectionName = "Movies" | "Games" | "People";

export function getImageSource(
  item: CountdownItem,
  sectionName: SectionName,
): string {
  if (sectionName === "Movies") {
    const movieItem = item as MovieCountdown;
    return `https://image.tmdb.org/t/p/${PosterSize.W300}${movieItem.poster_path}`;
  }

  if (sectionName === "People") {
    const personItem = item as PersonCountdownData;
    if (personItem.personProfilePath) {
      return `https://image.tmdb.org/t/p/w300${personItem.personProfilePath}`;
    }
    return "";
  }

  const gameItem = item as GameCountdown;
  return `https:${gameItem.game.cover?.url.replace("thumb", "cover_big_2x")}`;
}

export function getTitle(
  item: CountdownItem,
  sectionName: SectionName,
): string {
  if (sectionName === "Movies") {
    return (item as MovieCountdown).title;
  }

  if (sectionName === "People") {
    return (item as PersonCountdownData).personName;
  }

  return (item as GameCountdown).game.name;
}

export function formatReleaseDate(
  item: CountdownItem,
  sectionName: SectionName,
): string {
  if (sectionName === "Movies") {
    const movieItem = item as MovieCountdown;
    return movieItem.releaseDate
      ? isoToUTC(movieItem.releaseDate).toLocaleString(DateTime.DATE_MED)
      : "TBD";
  }

  if (sectionName === "People") {
    const personItem = item as PersonCountdownData;
    return personItem.nextMovie
      ? `Next: ${personItem.nextMovie.title}`
      : "No upcoming projects";
  }

  const gameItem = item as GameCountdown;
  return formatGameReleaseDate(gameItem.date, gameItem.human);
}

export function calculateDaysUntil(
  item: CountdownItem,
  sectionName: SectionName,
): number | null {
  const calculateCalendarDaysUntil = (targetDate: DateTime) => {
    const today = DateTime.now().startOf("day");
    const releaseDay = targetDate.startOf("day");

    return Math.floor(releaseDay.diff(today, "days").days);
  };

  const parseDateOnlyAsLocalDay = (dateString: string) => {
    const normalizedDate = dateString.trim().slice(0, 10);
    return DateTime.fromFormat(normalizedDate, "yyyy-MM-dd");
  };

  if (sectionName === "Movies") {
    const movieItem = item as MovieCountdown;
    if (!movieItem.releaseDate) return null;
    return calculateCalendarDaysUntil(
      parseDateOnlyAsLocalDay(movieItem.releaseDate),
    );
  }

  if (sectionName === "People") {
    const personItem = item as PersonCountdownData;
    if (!personItem.nextMovie) return null;
    return calculateCalendarDaysUntil(
      parseDateOnlyAsLocalDay(personItem.nextMovie.releaseDate),
    );
  }

  const gameItem = item as GameCountdown;
  if (!gameItem.date) return null;
  return calculateCalendarDaysUntil(
    parseDateOnlyAsLocalDay(timestampToUTC(gameItem.date).toISODate() ?? ""),
  );
}

export function getDocumentId(
  item: CountdownItem,
  sectionName: SectionName,
): string {
  if (sectionName === "Movies") {
    return (item as MovieCountdown).documentID;
  }

  if (sectionName === "People") {
    return (item as PersonCountdownData).personId;
  }

  return (item as GameCountdown).id.toString();
}

export function getAspectRatio(sectionName: SectionName): number {
  if (sectionName === "Movies") return 2 / 3;
  if (sectionName === "People") return 1;
  return 3 / 4;
}
