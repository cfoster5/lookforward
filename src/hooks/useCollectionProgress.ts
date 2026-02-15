import { useMemo } from "react";

import { useActiveCollections } from "@/api/collections";
import {
  CollectionProgress,
  CuratedCollection,
} from "@/interfaces/collections";
import { useSubscriptionHistoryStore } from "@/stores/subscriptionHistory";

/**
 * Calculates collection progress for a single collection based on user's subscription history.
 */
function calculateProgress(
  collection: CuratedCollection,
  validHistory: ReturnType<
    typeof useSubscriptionHistoryStore.getState
  >["getValidHistory"],
): CollectionProgress {
  const historyItems = validHistory();
  const historyMovieIds = new Set(historyItems.map((item) => item.movieId));

  // Movies from collection that user has valid history for
  const trackedMovieIds = collection.movieIds.filter((movieId) =>
    historyMovieIds.has(movieId),
  );

  // Movies tracked before the announcement date
  const announcedAtMs = collection.announcedAt.toMillis();
  const trackedBeforeAnnouncement = trackedMovieIds.filter((movieId) => {
    const historyItem = historyItems.find((item) => item.movieId === movieId);
    return historyItem && historyItem.firstSubscribedAt < announcedAtMs;
  });

  // Check if all movies are tracked
  const completedAt =
    trackedMovieIds.length === collection.movieIds.length
      ? Math.max(
          ...historyItems
            .filter((item) => collection.movieIds.includes(item.movieId))
            .map((item) => item.firstSubscribedAt),
        )
      : null;

  return {
    collectionId: collection.id,
    trackedMovieIds,
    trackedBeforeAnnouncement,
    totalInCollection: collection.movieIds.length,
    completedAt,
  };
}

/**
 * Hook that returns progress for all active collections.
 * Only use this for Pro users as the UI is gated.
 */
export function useCollectionsProgress() {
  const { data: collections, isLoading, error } = useActiveCollections();
  const getValidHistory = useSubscriptionHistoryStore(
    (state) => state.getValidHistory,
  );

  const progress = useMemo(() => {
    if (!collections) return [];
    return collections.map((collection) =>
      calculateProgress(collection, getValidHistory),
    );
  }, [collections, getValidHistory]);

  const collectionsWithProgress = useMemo(() => {
    if (!collections) return [];
    return collections.map((collection, index) => ({
      collection,
      progress: progress[index],
    }));
  }, [collections, progress]);

  return {
    collectionsWithProgress,
    isLoading,
    error,
  };
}

/**
 * Hook that returns progress for a single collection.
 */
export function useCollectionProgress(collection: CuratedCollection | null) {
  const getValidHistory = useSubscriptionHistoryStore(
    (state) => state.getValidHistory,
  );

  return useMemo(() => {
    if (!collection) return null;
    return calculateProgress(collection, getValidHistory);
  }, [collection, getValidHistory]);
}
