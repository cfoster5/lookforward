import { useQuery } from "@tanstack/react-query";

import { tmdb } from "@/providers/app";

const getPerson = async (personId: number) =>
  await tmdb.people.details(personId, ["movie_credits", "images"], "en-US");

export const usePerson = (personId: number) =>
  useQuery({
    queryKey: ["person", personId],
    queryFn: () => getPerson(personId),
  });
