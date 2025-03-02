import { tmdb } from "@/providers/app";
import { useQuery } from "@tanstack/react-query";

const getPerson = async (personId: Parameters<typeof tmdb.people.details>[0]) =>
  await tmdb.people.details(personId, ["movie_credits", "images"], "en-US");

export const usePerson = (
  personId: Parameters<typeof tmdb.people.details>[0],
) =>
  useQuery({
    queryKey: ["person", personId],
    queryFn: () => getPerson(personId),
  });
