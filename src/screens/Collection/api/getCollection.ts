import { useQuery } from "react-query";

import { TmdbKey } from "../../../constants/ApiKeys";

async function getCollection(collectionId: number) {
  const response = await fetch(
    `https://api.themoviedb.org/3/collection/${collectionId}?api_key=${TmdbKey}&language=en-US`
  );
  const json = await response.json();
  return json;
}

export function useCollection(collectionId: number) {
  return useQuery(["collection", collectionId], () =>
    getCollection(collectionId)
  );
}
