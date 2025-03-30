import { useLocales } from "expo-localization";
import { useQuery } from "react-query";

import { tmdb } from "@/providers/app";

const getCollection = async (
  collectionId: number,
  languageTag: ReturnType<typeof useLocales>[number]["languageTag"],
) =>
  await tmdb.collections.details(collectionId, {
    language: languageTag ?? "en-US",
  });

export const useCollection = (collectionId: number) => {
  const [locale] = useLocales();
  return useQuery(["collection", collectionId, locale.languageTag], () =>
    getCollection(collectionId, locale.languageTag),
  );
};
