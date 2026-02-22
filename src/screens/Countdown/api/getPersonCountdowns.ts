import { useQueries } from "@tanstack/react-query";

import { tmdb } from "@/providers/app";
import { useSubscriptionStore } from "@/stores";
import { useAppConfigStore } from "@/stores/appConfig";

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

  // Collect all future credits (cast + crew), deduplicate by movie ID
  const seenMovieIds = new Set<number>();
  const futureCredits: {
    id: number;
    title: string;
    poster_path: string | null;
    release_date: string;
  }[] = [];

  for (const credit of details.movie_credits.cast) {
    if (
      credit.release_date &&
      credit.release_date > today &&
      !seenMovieIds.has(credit.id)
    ) {
      seenMovieIds.add(credit.id);
      futureCredits.push({
        id: credit.id,
        title: credit.title,
        poster_path: credit.poster_path,
        release_date: credit.release_date,
      });
    }
  }

  for (const credit of details.movie_credits.crew) {
    if (
      credit.release_date &&
      credit.release_date > today &&
      !seenMovieIds.has(credit.id)
    ) {
      seenMovieIds.add(credit.id);
      futureCredits.push({
        id: credit.id,
        title: credit.title,
        poster_path: credit.poster_path,
        release_date: credit.release_date,
      });
    }
  }

  // Sort by release date ascending, pick soonest
  futureCredits.sort((a, b) => a.release_date.localeCompare(b.release_date));
  const soonest = futureCredits[0] ?? null;

  if (!soonest) {
    return {
      personId: personId.toString(),
      personName: name,
      personProfilePath: profilePath,
      nextMovie: null,
    };
  }

  // Fetch the region-specific release date for the soonest movie
  // This reuses getMovie which applies country filtering and premiere exclusion,
  // ensuring the person row shows the same date as the movie row
  const movieDetails = await getMovie(
    soonest.id.toString(),
    language,
    region,
  );

  return {
    personId: personId.toString(),
    personName: name,
    personProfilePath: profilePath,
    nextMovie: {
      id: soonest.id,
      title: soonest.title,
      posterPath: soonest.poster_path,
      releaseDate: movieDetails.releaseDate ?? soonest.release_date,
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
