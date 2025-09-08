import { useNavigation, NavigationProp } from "@react-navigation/native";
import { Image } from "expo-image";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { PlatformColor, Pressable, StyleSheet, Text, View } from "react-native";
import { PosterSizes } from "tmdb-ts";

import { removeSub } from "@/helpers/helpers";
import { ContextMenu } from "@/screens/Search/components/SearchBottomSheet/ContextMenu";
import { useRecentItemsStore } from "@/stores/recents";
import { useStore } from "@/stores/store";
import { CountdownStackParamList } from "@/types/navigation";
import { isoToUTC, now, timestamp, timestampToUTC } from "@/utils/dates";

import { useGameCountdowns } from "../api/getGameCountdowns";
import { useMovieCountdowns } from "../api/getMovieCountdowns";
import { usePeopleCountdowns } from "../api/getPeopleCountdowns";

interface MovieProps {
  item: ReturnType<typeof useMovieCountdowns>[number]["data"];
  sectionName: "Movies";
}

interface GameProps {
  item: ReturnType<typeof useGameCountdowns>[number]["data"];
  sectionName: "Games";
}

interface PeopleProps {
  item: ReturnType<typeof usePeopleCountdowns>[number]["data"];
  sectionName: "People";
}

type Props = MovieProps | GameProps | PeopleProps;

export function CountdownCard({ item, sectionName }: Props) {
  const { addRecent } = useRecentItemsStore();
  const { user, gameSubs } = useStore();
  const navigation = useNavigation<NavigationProp<CountdownStackParamList>>();

  function getFormattedDate(): string {
    if (sectionName === "Movies") {
      return item!.releaseDate
        ? isoToUTC(item!.releaseDate).toLocaleString(DateTime.DATE_MED)
        : "TBD";
    } else if (sectionName === "Games") {
      return item!.date
        ? timestampToUTC(item!.date).toFormat("MM/dd/yyyy")
        : item!.human;
    } else {
      // People don't have release dates
      return "No upcoming releases";
    }
  }

  function getDaysUntil(): number | "∞" {
    if (sectionName === "Movies") {
      return item!.releaseDate
        ? Math.ceil(isoToUTC(item!.releaseDate).diff(now).as("days"))
        : "∞";
    } else if (sectionName === "Games") {
      return item!.date
        ? Math.ceil(timestampToUTC(item!.date).diff(now).as("days"))
        : "∞";
    } else {
      // People don't have release dates
      return "∞";
    }
  }

  function handlePress() {
    if (sectionName === "Movies") handleMovieAction();
    else if (sectionName === "Games") handleGameAction();
    else if (sectionName === "People") handlePersonAction();
  }

  function handleRemove() {
    if (!user) return;

    if (sectionName === "Movies") {
      removeSub("movies", item!.id.toString(), user.uid);
    } else if (sectionName === "Games") {
      const gameCountdownId = gameSubs.find(
        (s) => s.game.id === item!.game.id,
      )?.documentID;
      if (gameCountdownId) {
        removeSub("gameReleases", gameCountdownId, user.uid);
      }
    } else if (sectionName === "People") {
      removeSub("people", item!.id.toString(), user.uid);
    }
  }

  function handleMovieAction() {
    navigation.navigate("Movie", {
      movieId: item!.id,
      name: item!.title,
    });
    addRecent("recentMovies", {
      id: item!.id,
      name: item!.title,
      img_path: item!.poster_path,
      last_viewed: timestamp,
      media_type: "movie",
    });
  }

  function handleGameAction() {
    navigation.navigate("Game", {
      game: {
        id: item!.game.id,
        name: item!.game.name,
        cover: { url: item!.game.cover.url },
        release_dates: [], // Add empty release_dates to satisfy type
      },
    });
    addRecent("recentGames", {
      id: item!.game.id,
      name: item!.game.name,
      img_path: item!.game.cover?.url ?? "",
      last_viewed: timestamp,
      media_type: "game",
    });
  }

  function handlePersonAction() {
    navigation.navigate("Actor", {
      personId: item!.id,
      name: item!.name,
    });
    addRecent("recentPeople", {
      id: item!.id,
      name: item!.name,
      img_path: item!.profile_path,
      last_viewed: timestamp,
    });
  }

  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          width: 120,
          marginRight: 12,
          backgroundColor: PlatformColor("systemGray6"),
          borderRadius: 12,
          overflow: "hidden",
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderColor: PlatformColor("separator"),
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 8,
          shadowColor: "rgba(0, 0, 0, 0.15)",
          shadowOpacity: 1,
        },
        imageContainer: {
          width: "100%",
          aspectRatio:
            sectionName === "Movies"
              ? 2 / 3
              : sectionName === "Games"
                ? 3 / 4
                : 1, // People profile photos are square
          backgroundColor: PlatformColor("systemGray4"),
        },
        image: {
          width: "100%",
          height: "100%",
          borderRadius: sectionName === "People" ? 60 : 0,
          borderWidth: sectionName === "People" ? StyleSheet.hairlineWidth : 0,
          borderColor: PlatformColor("separator"),
        },
        placeholderContainer: {
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: PlatformColor("systemGray"),
          borderRadius: sectionName === "People" ? 60 : 0,
        },
        placeholderText: {
          color: "white",
          fontSize: sectionName === "People" ? 16 : 12,
          fontWeight: "bold",
        },
        content: {
          padding: 8,
          minHeight: 60,
        },
        title: {
          fontSize: 12,
          fontWeight: "600",
          color: PlatformColor("label"),
          marginBottom: 2,
          lineHeight: 16,
        },
        subtitle: {
          fontSize: 10,
          color: PlatformColor("secondaryLabel"),
          marginBottom: 4,
          lineHeight: 12,
        },
        countdown: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        },
        countdownNumber: {
          fontSize: 14,
          fontWeight: "600",
          color: PlatformColor("systemBlue"),
          marginRight: 2,
        },
        countdownLabel: {
          fontSize: 10,
          color: PlatformColor("systemBlue"),
        },
      }),
    [sectionName],
  );

  let imageSrc = "";
  let title = "";
  if (sectionName === "Movies") {
    imageSrc = `https://image.tmdb.org/t/p/${PosterSizes.W300}${item!.poster_path}`;
    title = item!.title;
  } else if (sectionName === "Games") {
    imageSrc = `https:${item!.game.cover.url.replace("thumb", "cover_big_2x")}`;
    title = item!.game.name;
  } else if (sectionName === "People") {
    imageSrc = item!.profile_path
      ? `https://image.tmdb.org/t/p/${PosterSizes.W300}${item!.profile_path}`
      : "";
    title = item!.name;
  }

  const daysUntil = getDaysUntil();

  return (
    <ContextMenu
      handleCountdownToggle={{
        action: handleRemove,
        buttonText: "Remove from Pins",
      }}
    >
      <Pressable
        onPress={handlePress}
        style={styles.card}
        // https://github.com/dominicstop/react-native-ios-context-menu/issues/9#issuecomment-1047058781
        delayLongPress={100} // Leave room for a user to be able to click
        onLongPress={() => {}} // A callback that does nothing
      >
        <View style={styles.imageContainer}>
          {imageSrc ? (
            <Image
              style={styles.image}
              source={{ uri: imageSrc }}
              contentFit="cover"
            />
          ) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>
                {sectionName === "People"
                  ? title
                      .split(" ")
                      .map((word) => word.charAt(0))
                      .slice(0, 2)
                      .join("")
                  : "?"}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {getFormattedDate()}
          </Text>
          <View style={styles.countdown}>
            <Text style={styles.countdownNumber}>{daysUntil}</Text>
            <Text style={styles.countdownLabel}>days</Text>
          </View>
        </View>
      </Pressable>
    </ContextMenu>
  );
}
