import { useEffect, useState } from "react";

import { getDiscoverMovies } from "../helpers/tmdbRequests";

export function useGetDiscoverMovies(discoverFilter, pageIndex) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    async function getMovies() {
      const json = await getDiscoverMovies({
        ...discoverFilter,
        pageIndex: pageIndex,
      });
      setMovies([...movies, ...json.results]);
    }
    getMovies();
  }, [discoverFilter, pageIndex]);

  return movies;
}
