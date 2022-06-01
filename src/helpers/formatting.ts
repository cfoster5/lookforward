import { DateTime } from "luxon";

export function dateToLocaleString(input: string): string {
  return DateTime.fromFormat(input, "yyyy-MM-dd")
    .toFormat("MMMM d, yyyy")
    .toUpperCase();
}

export function getRuntime(runtime?: number): string | undefined {
  if (runtime) {
    let minutes = runtime % 60;
    let hours = (runtime - minutes) / 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  }
}
