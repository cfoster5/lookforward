import { useEffect, useState } from "react";

import { MovieWatchProvider } from "../interfaces/tmdb.old";

export function useGetMovieWatchProviders(hasAny?: boolean) {
  const [providers, setProviders] = useState<MovieWatchProvider[]>(
    hasAny
      ? [
          {
            display_priority: 0,
            logo_path: "",
            provider_id: 0,
            provider_name: "Any",
          },
        ]
      : []
  );

  useEffect(() => {
    async function getProviders() {
      const response = await fetch(
        `https://api.themoviedb.org/3/watch/providers/movie?api_key=68991fbb0b75dba5ae0ecd8182e967b1&language=en-US&watch_region=US`
      );
      const json = await response.json();
      setProviders([...providers, ...json.results]);
    }
    getProviders();
  }, [setProviders]);

  return providers;
}
