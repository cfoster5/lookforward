import { useQueries } from "@tanstack/react-query";

import { tmdb } from "@/providers/app";
import { useAppConfigStore } from "@/stores/appConfig";
import { useSubscriptionStore } from "@/stores/subscription";

import { getMovie } from "./getMovieCountdowns";

export interface PersonCountdownData {
  personId: string;
  personName: string;
  personProfilePath: string | null;
  nextMovie: {
    id: number;
    title: string;
    posterPath: string | null;
    releaseDate: string;
  } | null;
}

export async function getPersonCountdown(
  personId: number,
  name: string,
  profilePath: string | null,
  language: string,
  region: string,
): Promise<PersonCountdownData> {
  const details = await tmdb.people.details(
    personId,
    ["movie_credits"],
    `${language}-${region}`,
  );

  const today = new Date().toISOString().split("T")[0];

  // Collect all upcoming credits (cast + crew), deduplicate by movie ID.
  // We include credits with any release date (not just future) because the
  // generic TMDB date may differ from the region-specific date — a movie can
  // appear "released" globally while still upcoming in the user's region.
  const seenMovieIds = new Set<number>();
  const candidateCredits: {
    id: number;
    title: string;
    poster_path: string | null;
    release_date: string;
  }[] = [];

  for (const credit of [
    ...details.movie_credits.cast,
    ...details.movie_credits.crew,
  ]) {
    if (credit.release_date && !seenMovieIds.has(credit.id)) {
      seenMovieIds.add(credit.id);
      candidateCredits.push({
        id: credit.id,
        title: credit.title,
        poster_path: credit.poster_path,
        release_date: credit.release_date,
      });
    }
  }

  // Fetch region-specific release dates for all candidates so we filter and
  // sort using the same dates the movie countdown screen shows.
  const movieDetailsResults = await Promise.all(
    candidateCredits.map((credit) =>
      getMovie(credit.id.toString(), language, region),
    ),
  );

  const futureCredits = candidateCredits
    .map((credit, index) => {
      const regionalDate = movieDetailsResults[index].releaseDate;
      const effectiveDate = regionalDate ?? credit.release_date;
      return { ...credit, effectiveDate };
    })
    .filter((credit) => credit.effectiveDate > today)
    .sort((a, b) => a.effectiveDate.localeCompare(b.effectiveDate));

  const soonest = futureCredits[0] ?? null;

  if (!soonest) {
    return {
      personId: personId.toString(),
      personName: name,
      personProfilePath: profilePath,
      nextMovie: null,
    };
  }

  return {
    personId: personId.toString(),
    personName: name,
    personProfilePath: profilePath,
    nextMovie: {
      id: soonest.id,
      title: soonest.title,
      posterPath: soonest.poster_path,
      releaseDate: soonest.effectiveDate,
    },
  };
}

export function usePersonCountdowns() {
  const { personSubs } = useSubscriptionStore();
  const movieLanguage = useAppConfigStore((state) => state.movieLanguage);
  const movieRegion = useAppConfigStore((state) => state.movieRegion);

  return useQueries({
    queries: personSubs.map((sub) => ({
      queryKey: ["personCountdown", sub.documentID, movieLanguage, movieRegion],
      queryFn: () =>
        getPersonCountdown(
          Number(sub.documentID),
          sub.name,
          sub.profilePath,
          movieLanguage,
          movieRegion,
        ),
      staleTime: 30 * 60 * 1000,
    })),
    combine: (results) => {
      const data = results
        .map((result, index) => {
          // On success, use fetched data; on error, fall back to Firestore metadata
          if (result.data) return result.data;
          if (!result.isError) return undefined;
          const sub = personSubs[index];
          if (!sub) return undefined;
          return {
            personId: sub.documentID,
            personName: sub.name,
            personProfilePath: sub.profilePath,
            nextMovie: null,
          } satisfies PersonCountdownData;
        })
        .filter((d): d is PersonCountdownData => d !== undefined)
        .sort((a, b) => {
          // People with upcoming movies first, sorted by soonest release
          if (!a.nextMovie && !b.nextMovie) return 0;
          if (!a.nextMovie) return 1;
          if (!b.nextMovie) return -1;
          return a.nextMovie.releaseDate.localeCompare(b.nextMovie.releaseDate);
        });

      return {
        data,
        pending: results.some((result) => result.isPending),
      };
    },
  });
}
