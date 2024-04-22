import { useQuery } from "react-query";

import { tmdb } from "@/providers/app";

const getCollection = async (collectionId: number) =>
  await tmdb.collections.details(collectionId, { language: "en-US" });

export const useCollection = (collectionId: number) =>
  useQuery(["collection", collectionId], () => getCollection(collectionId));
