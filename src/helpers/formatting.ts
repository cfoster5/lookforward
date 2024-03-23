import { DateTime } from "luxon";

export function dateToLocaleString(input: string): string {
  return DateTime.fromFormat(input, "yyyy-MM-dd")
    .toFormat("MMMM d, yyyy")
    .toUpperCase();
}
