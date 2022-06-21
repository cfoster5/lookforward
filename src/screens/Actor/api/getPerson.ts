import { useQuery } from "react-query";
import { TmdbKey } from "constants/ApiKeys";

async function getPerson(personId: number) {
  const response = await fetch(
    `https://api.themoviedb.org/3/person/${personId}?api_key=${TmdbKey}&language=en-US&append_to_response=movie_credits,images`
  );
  const json = await response.json();
  return json;
}

export function usePerson(personId: number) {
  return useQuery(["person", personId], () => getPerson(personId));
}
