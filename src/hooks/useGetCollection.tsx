import { useEffect, useState } from "react";

import { CollectionDetails } from "../interfaces/tmdb";

export function useGetCollection(collectionId: number) {
  const [state, setState] = useState<{
    collection?: CollectionDetails;
    loading: boolean;
  }>({ collection: undefined, loading: true });

  useEffect(() => {
    async function getCollection() {
      const tmdbResponse = await fetch(
        `https://api.themoviedb.org/3/collection/${collectionId}?api_key=68991fbb0b75dba5ae0ecd8182e967b1&language=en-US`
      );
      const json = await tmdbResponse.json();

      setState({
        collection: json,
        loading: false,
      });
    }
    getCollection();
  }, [collectionId]);

  return state;
}
