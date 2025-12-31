import { useQuery } from "@tanstack/react-query";

import { tmdb } from "@/providers/app";
import { useAppConfigStore } from "@/stores/appConfig";

const getCollection = async (collectionId: number, language: string) =>
  await tmdb.collections.details(collectionId, { language });

export const useCollection = (collectionId: number) => {
  const movieLanguage = useAppConfigStore((state) => state.movieLanguage);
  const movieRegion = useAppConfigStore((state) => state.movieRegion);

  return useQuery({
    queryKey: ["collection", collectionId, movieLanguage, movieRegion],
    queryFn: () =>
      getCollection(collectionId, `${movieLanguage}-${movieRegion}`),
  });
};
