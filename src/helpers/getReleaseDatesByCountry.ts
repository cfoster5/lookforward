import { ReleaseDateResult, ReleaseDates } from "tmdb-ts";

export const getReleaseDatesByCountry = (
  releaseDates: ReleaseDates = { id: 0, results: [] },
  country: ReleaseDateResult["iso_3166_1"],
) =>
  releaseDates?.results.find((result) => result.iso_3166_1 === country)
    ?.release_dates;
