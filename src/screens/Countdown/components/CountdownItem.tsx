import { useNavigation, NavigationProp } from "@react-navigation/native";
import { Image } from "expo-image";
import { DateTime } from "luxon";
import { useEffect, useMemo } from "react";
import { PlatformColor, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { iOSUIKit } from "react-native-typography";
import { PosterSizes } from "tmdb-ts";

import { useRecentItemsStore } from "@/stores/recents";
import { useCountdownStore } from "@/stores/store";
import { CountdownStackParamList } from "@/types/navigation";
import { isoToUTC, now, timestamp, timestampToUTC } from "@/utils/dates";

import { useGameCountdowns } from "../api/getGameCountdowns";
import { useMovieCountdowns } from "../api/getMovieCountdowns";
import { usePeopleCountdowns } from "../api/getPeopleCountdowns";

import { RadioButton } from "./RadioButton";

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

type Props = (MovieProps | GameProps | PeopleProps) & {
  isLastInSection: boolean;
};

const staticStyles = StyleSheet.create({
  radioWrapper: { justifyContent: "center" },
  imageWrapper: {
    justifyContent: "center",
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    shadowColor: "rgba(0, 0, 0, 0.15)",
    shadowOpacity: 1,
  },
});

export function CountdownItem({ item, sectionName, isLastInSection }: Props) {
  const {
    showDeleteButton,
    movies: selectedMovies,
    games: selectedGames,
    people: selectedPeople,
    toggleSelection,
  } = useCountdownStore();
  const { addRecent } = useRecentItemsStore();
  const navigation = useNavigation<NavigationProp<CountdownStackParamList>>();
  const transformAmount = useSharedValue(-24);

  useEffect(() => {
    transformAmount.value = withTiming(!showDeleteButton ? -24 : 16);
  }, [showDeleteButton, transformAmount]);

  const isSelected =
    sectionName === "Movies"
      ? selectedMovies.includes(item!.documentID)
      : sectionName === "Games"
        ? selectedGames.includes(item!.id.toString())
        : selectedPeople.includes(item!.documentID);

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

  function handleMovieAction() {
    if (showDeleteButton) {
      // toggleMovieSelection(item);
      toggleSelection(item!.documentID, "movies");
    } else {
      goToMovie();
    }
  }

  function goToMovie() {
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
    if (showDeleteButton) {
      // toggleGameSelection(item);
      toggleSelection(item!.id.toString(), "games");
    } else {
      goToGame();
    }
  }

  function goToGame() {
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
    if (showDeleteButton) {
      toggleSelection(item!.documentID, "people");
    } else {
      goToPerson();
    }
  }

  function goToPerson() {
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
        rowFront: {
          borderBottomLeftRadius:
            sectionName === "People" && isLastInSection ? 10 : 0,
          borderBottomRightRadius:
            sectionName === "People" && isLastInSection ? 10 : 0,
          overflow: "hidden",
          backgroundColor: isSelected
            ? PlatformColor("systemGray4")
            : PlatformColor("systemGray6"),
        },
        slide: {
          flex: 1,
          flexDirection: "row",
          flexWrap: "wrap",
        },
        image: {
          width: 60,
          aspectRatio:
            sectionName === "Movies"
              ? 2 / 3
              : sectionName === "Games"
                ? 3 / 4
                : 1, // People profile photos are square
          borderRadius: sectionName === "People" ? 30 : 6, // Round for people, rectangular for movies/games
          marginLeft: 16,
          marginTop: 8,
          marginBottom: 8,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: PlatformColor("separator"),
        },
        middle: {
          borderColor: PlatformColor("separator"),
          borderBottomWidth: isLastInSection ? 0 : StyleSheet.hairlineWidth,
          flex: 1,
          justifyContent: "center",
          marginLeft: 16,
          paddingTop: 8,
          paddingBottom: 8,
        },
        countdown: {
          borderColor: PlatformColor("separator"),
          borderBottomWidth: isLastInSection ? 0 : StyleSheet.hairlineWidth,
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 8,
          paddingBottom: 8,
        },
      }),
    [sectionName, isLastInSection, isSelected],
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

  const slideStyle = useAnimatedStyle(() => ({
    // No need for interpolation here, since the value maps directly to the desired values
    transform: [{ translateX: transformAmount.value }],
  }));

  const radioButtonStyle = useAnimatedStyle(() => ({
    // when value is -24, opacity is 0
    // when value is 16, opacity is 1
    opacity: interpolate(transformAmount.value, [-24, 16], [0, 1]),
  }));

  return (
    <Pressable onPress={handlePress} style={styles.rowFront}>
      <Animated.View style={[styles.slide, slideStyle]}>
        <Animated.View style={[staticStyles.radioWrapper, radioButtonStyle]}>
          <RadioButton isSelected={isSelected} />
        </Animated.View>
        <View style={staticStyles.imageWrapper}>
          {imageSrc ? (
            <Image
              style={styles.image}
              source={{ uri: imageSrc }}
              contentFit="cover"
            />
          ) : sectionName === "People" ? (
            <View
              style={[
                styles.image,
                {
                  backgroundColor: PlatformColor("systemGray"),
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                {title
                  .split(" ")
                  .map((word) => word.charAt(0))
                  .slice(0, 2)
                  .join("")}
              </Text>
            </View>
          ) : (
            <View
              style={[
                styles.image,
                { backgroundColor: PlatformColor("systemGray") },
              ]}
            />
          )}
        </View>
        <View style={styles.middle}>
          <Text
            style={[iOSUIKit.body, { color: PlatformColor("label") }]}
            numberOfLines={2}
          >
            {title}
          </Text>
          <Text
            style={[
              iOSUIKit.subhead,
              { color: PlatformColor("secondaryLabel") },
            ]}
          >
            {getFormattedDate()}
          </Text>
        </View>
        <View style={styles.countdown}>
          <Text
            style={[
              iOSUIKit.bodyEmphasized,
              { color: PlatformColor("systemBlue") },
            ]}
          >
            {getDaysUntil()}
          </Text>
          <Text style={[iOSUIKit.body, { color: PlatformColor("systemBlue") }]}>
            days
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}
