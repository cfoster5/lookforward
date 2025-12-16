import { useQuery } from "@tanstack/react-query";

import { tmdb } from "@/providers/app";
import { useAppConfigStore } from "@/stores/appConfig";

const getPerson = async (personId: number, language: string) =>
  await tmdb.people.details(personId, ["movie_credits", "images"], language);

export const usePerson = (personId: number) => {
  const movieLanguage = useAppConfigStore((state) => state.movieLanguage);
  const movieRegion = useAppConfigStore((state) => state.movieRegion);

  return useQuery({
    queryKey: ["person", personId, movieLanguage, movieRegion],
    queryFn: () => getPerson(personId, `${movieLanguage}-${movieRegion}`),
  });
};
