import { DateTime } from "luxon";

export const now = DateTime.now();

export const timestamp = now.toSeconds();

export const timestampToUTC = (timestamp: number) =>
  DateTime.fromSeconds(timestamp).toUTC();

export const isoToUTC = (iso: Date) => DateTime.fromISO(iso).toUTC();

export const compareDates = (a: DateTime, b: DateTime) =>
  a.toMillis() - b.toMillis();

export const dateToFullLocale = (input: string) =>
  DateTime.fromFormat(input, "yyyy-MM-dd").toLocaleString(DateTime.DATE_FULL);

export const formatGameReleaseDate = (date: number | null, human: string) =>
  date ? timestampToUTC(date).toFormat("MM/dd/yyyy") : human;
