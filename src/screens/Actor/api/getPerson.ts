import { useLocales } from "expo-localization";
import { useQuery } from "react-query";

import { tmdb } from "@/providers/app";

const getPerson = async (
  personId: number,
  languageTag: ReturnType<typeof useLocales>[number]["languageTag"],
) =>
  await tmdb.people.details(
    personId,
    ["movie_credits", "images"],
    languageTag ?? "en-US",
  );

export const usePerson = (personId: number) => {
  const [locale] = useLocales();
  return useQuery(["person", personId, locale.languageTag], () =>
    getPerson(personId, locale.languageTag),
  );
};
