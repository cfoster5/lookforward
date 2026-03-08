import { Image } from "expo-image";
import { Link } from "expo-router";
import { SFSymbol } from "expo-symbols";
import { usePostHog } from "posthog-react-native";
import { Platform, View, Text, StyleSheet } from "react-native";
import { iOSUIKit } from "react-native-typography";

import { IconSymbol } from "@/components/IconSymbol";
import {
  CollectionProgress,
  CuratedCollection,
} from "@/interfaces/collections";
import { colors } from "@/theme/colors";

interface CollectionProgressCardProps {
  collection: CuratedCollection;
  progress: CollectionProgress;
}

export function CollectionProgressCard({
  collection,
  progress,
}: CollectionProgressCardProps) {
  const posthog = usePostHog();
  const earlyTrackedCount = progress.trackedBeforeAnnouncement.length;
  const hasEarlyTracked = earlyTrackedCount > 0;

  // Get icon based on category
  const getCategoryIcon = (
    category: CuratedCollection["category"],
  ): SFSymbol => {
    switch (category) {
      case "oscars":
        return "trophy.fill";
      case "franchise":
        return "film.stack.fill";
      case "seasonal":
        return "calendar";
      default:
        return "star.fill";
    }
  };

  const iconName =
    (collection.badgeIcon as SFSymbol) ?? getCategoryIcon(collection.category);

  return (
    <Link
      href={{
        pathname: "/(tabs)/(countdown)/collection",
        params: { id: collection.id },
      }}
      style={styles.card}
      onPress={() => {
        posthog.capture("collection_card:tap", {
          collection_id: collection.id,
          category: collection.category,
          tracked_count: progress.trackedMovieIds.length,
          total_movies: collection.movieIds.length,
          has_early_tracked: hasEarlyTracked,
        });
      }}
      asChild
    >
      <View style={styles.row}>
        <View style={styles.content}>
          <View style={styles.header}>
            <IconSymbol name={iconName} size={20} color="#FFD60A" />
            <Text style={styles.title}>{collection.name}</Text>
          </View>

          {hasEarlyTracked && (
            <View style={styles.earlyTrackerRow}>
              <IconSymbol name="star.fill" size={14} color="#FF9500" />
              <Text style={styles.earlyTrackerText}>
                {earlyTrackedCount} tracked before nominations!
              </Text>
            </View>
          )}
        </View>

        {Platform.OS === "ios" ? (
          <Image
            source="sf:chevron.right"
            style={{ aspectRatio: 1, height: 17 }}
            tintColor={colors.tertiaryLabel as string}
          />
        ) : (
          <IconSymbol
            name="chevron.right"
            size={17}
            color={colors.tertiaryLabel as string}
          />
        )}
      </View>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.secondarySystemGroupedBackground,
    borderRadius: 26,
    padding: 16,
    marginVertical: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    ...iOSUIKit.bodyEmphasizedObject,
    color: colors.label,
    flex: 1,
  },
  earlyTrackerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 6,
  },
  earlyTrackerText: {
    ...iOSUIKit.footnoteEmphasizedObject,
    color: colors.systemOrange,
  },
});
