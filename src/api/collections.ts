import {
  collection,
  getFirestore,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  Timestamp,
} from "@react-native-firebase/firestore";
import { useQuery } from "@tanstack/react-query";

import { CuratedCollection } from "@/interfaces/collections";

/**
 * Fetches all active collections from Firestore.
 * Active collections are those where:
 * - activeFrom <= now
 * - activeUntil is null OR activeUntil >= now
 */
async function fetchActiveCollections(): Promise<CuratedCollection[]> {
  const db = getFirestore();
  const now = Timestamp.now();

  const collectionsRef = collection(db, "collections");
  const activeQuery = query(collectionsRef, where("activeFrom", "<=", now));

  const snapshot = await getDocs(activeQuery);
  const collections: CuratedCollection[] = [];

  for (const docSnapshot of snapshot.docs) {
    const data = docSnapshot.data() as Omit<CuratedCollection, "id">;
    // Filter out collections that have expired
    const isActive =
      data.activeUntil === null ||
      data.activeUntil.toMillis() >= now.toMillis();
    if (isActive) {
      collections.push({
        id: docSnapshot.id,
        ...data,
      });
    }
  }

  return collections;
}

/**
 * Fetches a single collection by ID.
 */
async function fetchCollection(
  collectionId: string,
): Promise<CuratedCollection | null> {
  const db = getFirestore();
  const docRef = doc(db, "collections", collectionId);
  const docSnapshot = await getDoc(docRef);

  if (!docSnapshot.exists) {
    return null;
  }

  const data = docSnapshot.data() as Omit<CuratedCollection, "id">;
  return {
    id: docSnapshot.id,
    ...data,
  };
}

/**
 * React Query hook to fetch all active collections.
 */
export const useActiveCollections = () =>
  useQuery({
    queryKey: ["collections", "active"],
    queryFn: fetchActiveCollections,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

/**
 * React Query hook to fetch a single collection by ID.
 */
export const useCollection = (collectionId: string) =>
  useQuery({
    queryKey: ["collections", collectionId],
    queryFn: () => fetchCollection(collectionId),
    enabled: !!collectionId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
