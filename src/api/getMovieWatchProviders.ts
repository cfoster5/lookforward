import { useQuery } from "react-query";

async function getProviders() {
  const response = await fetch(
    `https://api.themoviedb.org/3/watch/providers/movie?api_key=68991fbb0b75dba5ae0ecd8182e967b1&language=en-US&watch_region=US`
  );
  const json = await response.json();
  return json;
}

export function useMovieWatchProviders() {
  return useQuery(["movieWatchProviders"], getProviders, {
    select: (providersData) => providersData.results,
  });
}
