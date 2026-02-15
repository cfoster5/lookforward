import { Timestamp } from "@react-native-firebase/firestore";

export type CollectionCategory = "oscars" | "franchise" | "seasonal" | "custom";

export interface CuratedCollection {
  id: string; // e.g., "oscars-2026-best-picture"
  name: string; // "Best Picture 2026"
  description: string; // "Academy Award nominees for Best Picture"
  category: CollectionCategory;
  movieIds: string[]; // Array of TMDB movie IDs
  announcedAt: Timestamp; // When collection was revealed (for "early tracker" cutoff)
  activeFrom: Timestamp; // When to start showing this collection
  activeUntil: Timestamp | null; // When to stop showing (null = forever)
  badgeIcon?: string; // SF Symbol name for badge
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CollectionProgress {
  collectionId: string;
  trackedMovieIds: string[]; // Movies from collection user subscribed to
  trackedBeforeAnnouncement: string[]; // Subset tracked before announcedAt
  totalInCollection: number;
  completedAt: number | null; // Timestamp when they achieved 100% (if ever)
}
