import { useLocales } from "expo-localization";
import { useQueries } from "react-query";
import { ReleaseDateType } from "tmdb-ts";

import { getReleaseDatesByCountry } from "@/helpers/getReleaseDatesByCountry";
import { FirestoreMovie } from "@/interfaces/firebase";
import { tmdb } from "@/providers/app";
import { useStore } from "@/stores/store";
import { compareDates, isoToUTC } from "@/utils/dates";

async function getMovie(
  movieId: FirestoreMovie["documentID"],
  locale: ReturnType<typeof useLocales>[number],
) {
  const json = await tmdb.movies.details(
    Number(movieId),
    ["release_dates"],
    locale.languageTag ?? "en-US",
  );

  const localeReleaseDates = getReleaseDatesByCountry(
    json.release_dates,
    locale.regionCode ?? "US",
  );

  const sortedNonPremiereDates = localeReleaseDates
    ?.filter((release) => release.type !== ReleaseDateType.Premiere)
    .sort(({ release_date: a }, { release_date: b }) =>
      compareDates(isoToUTC(a), isoToUTC(b)),
    );

  const date = sortedNonPremiereDates?.[0]?.release_date;

  return {
    ...json,
    releaseDate: date,
    documentID: movieId,
  };
}

export function useMovieCountdowns() {
  const { movieSubs } = useStore();
  const [locale] = useLocales();
  return useQueries(
    movieSubs.map((sub) => {
      return {
        queryKey: ["movieSubs", sub.documentID],
        queryFn: () => getMovie(sub.documentID, locale),
      };
    }),
  );
}
