import { ReleaseDate, ReleaseDateType } from "tmdb-ts";

import { compareDates, isoToUTC } from "@/utils/dates";

function earliest(dates: ReleaseDate[]): ReleaseDate {
  return [...dates].sort(({ release_date: a }, { release_date: b }) =>
    compareDates(isoToUTC(a), isoToUTC(b)),
  )[0];
}

/**
 * Selects the preferred release date from a list of release dates.
 * Prefers Theatrical (type 3) over Limited (type 2) over other types.
 * Filters out Premiere (type 1) dates entirely.
 * Within each priority bucket, picks the earliest date.
 */
export function getPreferredReleaseDate(
  releaseDates: ReleaseDate[],
): ReleaseDate | undefined {
  const theatricalDates = releaseDates.filter(
    (release) => release.type === ReleaseDateType.Theatrical,
  );
  if (theatricalDates.length > 0) return earliest(theatricalDates);

  const limitedDates = releaseDates.filter(
    (release) => release.type === ReleaseDateType["Theatrical (limited)"],
  );
  if (limitedDates.length > 0) return earliest(limitedDates);

  const nonPremiereDates = releaseDates.filter(
    (release) => release.type !== ReleaseDateType.Premiere,
  );
  if (nonPremiereDates.length === 0) return undefined;

  return earliest(nonPremiereDates);
}
