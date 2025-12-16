import { ReleaseDates } from "tmdb-ts";

import { useAppConfigStore } from "@/stores/appConfig";

export const getReleaseDatesByCountry = (
  releaseDates?: Omit<ReleaseDates, "id">,
) => {
  const country = useAppConfigStore.getState().movieRegion;
  return releaseDates?.results?.find((result) => result.iso_3166_1 === country)
    ?.release_dates;
};
