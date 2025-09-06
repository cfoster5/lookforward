import { useQueries } from "@tanstack/react-query";

import { FirestorePerson } from "@/interfaces/firebase";
import { tmdb } from "@/providers/app";
import { useStore } from "@/stores/store";

export async function getPerson(personId: FirestorePerson["documentID"]) {
  const json = await tmdb.people.details(Number(personId), [], "en-US");

  return {
    ...json,
    documentID: personId,
  };
}

export function usePeopleCountdowns() {
  const { peopleSubs } = useStore();
  return useQueries({
    queries: peopleSubs.map((sub) => ({
      queryKey: ["personSub", sub.documentID],
      queryFn: () => getPerson(sub.documentID),
    })),
  });
}
