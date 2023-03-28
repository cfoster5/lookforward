import { DateTime } from "luxon";

export const now = DateTime.now();

export const timestamp = now.toSeconds();

export const timestampToUTC = (timestamp: number) =>
  DateTime.fromSeconds(timestamp).toUTC();

export const isoToUTC = (iso: string) => DateTime.fromISO(iso).toUTC();

export const compareDates = (a: DateTime, b: DateTime) =>
  a.toMillis() - b.toMillis();
