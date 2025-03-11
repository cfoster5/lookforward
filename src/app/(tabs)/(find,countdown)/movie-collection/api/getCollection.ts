import { useQuery } from "@tanstack/react-query";

import { tmdb } from "@/providers/app";

const getCollection = async (collectionId: number) =>
  await tmdb.collections.details(collectionId, { language: "en-US" });

export const useCollection = (collectionId: number) =>
  useQuery({
    queryKey: ["collection", collectionId],
    queryFn: () => getCollection(collectionId),
  });
