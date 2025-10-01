import * as Colors from "@bacons/apple-colors";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { DateTime } from "luxon";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { iOSUIKit } from "react-native-typography";
import { PosterSizes } from "tmdb-ts";

import { useCountdownStore } from "@/stores";
import { isoToUTC, now, timestampToUTC } from "@/utils/dates";

import { useGameCountdowns } from "../api/getGameCountdowns";
import { useMovieCountdowns } from "../api/getMovieCountdowns";

import { RadioButton } from "./RadioButton";

interface MovieProps {
  item: ReturnType<typeof useMovieCountdowns>[number]["data"];
  sectionName: "Movies";
}

interface GameProps {
  item: ReturnType<typeof useGameCountdowns>[number]["data"];
  sectionName: "Games";
}

type Props = (MovieProps | GameProps) & {
  isLastInSection: boolean;
  isFirstInSection: boolean;
};

export function CountdownItem({
  item,
  sectionName,
  isLastInSection,
  isFirstInSection,
}: Props) {
  const router = useRouter();
  const {
    isEditing,
    movies: selectedMovies,
    games: selectedGames,
    toggleSelection,
  } = useCountdownStore();
  const transformAmount = useSharedValue(-24);

  useEffect(() => {
    transformAmount.value = withTiming(!isEditing ? -24 : 16);
  }, [isEditing, transformAmount]);

  const isSelected =
    sectionName === "Movies"
      ? selectedMovies.includes(item!.documentID)
      : selectedGames.includes(item!.id.toString());

  function getFormattedDate(): string {
    if (sectionName === "Movies") {
      return item!.releaseDate
        ? isoToUTC(item!.releaseDate).toLocaleString(DateTime.DATE_MED)
        : "TBD";
    } else {
      return item!.date
        ? timestampToUTC(item!.date).toFormat("MM/dd/yyyy")
        : item!.human;
    }
  }

  function getDaysUntil(): number | "∞" {
    if (sectionName === "Movies") {
      return item!.releaseDate
        ? Math.ceil(isoToUTC(item!.releaseDate).diff(now).as("days"))
        : "∞";
    } else {
      return item!.date
        ? Math.ceil(timestampToUTC(item!.date).diff(now).as("days"))
        : "∞";
    }
  }

  function handlePress() {
    if (sectionName === "Movies") handleMovieAction();
    else if (sectionName === "Games") handleGameAction();
  }

  function handleMovieAction() {
    if (isEditing) {
      // toggleMovieSelection(item);
      toggleSelection(item!.documentID, "movies");
    } else {
      goToMovie();
    }
  }

  function goToMovie() {
    router.navigate({
      pathname: "/(tabs)/(countdown)/movie/[id]",
      params: {
        id: item!.id,
        name: item!.title,
      },
    });
  }

  function handleGameAction() {
    if (isEditing) {
      // toggleGameSelection(item);
      toggleSelection(item!.id.toString(), "games");
    } else {
      goToGame();
    }
  }

  function goToGame() {
    router.navigate({
      pathname: "/(tabs)/(countdown)/game/[id]",
      params: {
        id: item!.id,
        game: JSON.stringify({
          id: item!.game.id,
          name: item!.game.name,
          cover: { url: item!.game.cover.url },
        }),
      },
    });
  }

  const styles = StyleSheet.create({
    rowFront: {
      borderTopLeftRadius: isFirstInSection ? 10 : 0,
      borderTopRightRadius: isFirstInSection ? 10 : 0,
      borderBottomLeftRadius: isLastInSection ? 10 : 0,
      borderBottomRightRadius: isLastInSection ? 10 : 0,
      overflow: "hidden",
      backgroundColor: isSelected ? Colors.systemGray4 : Colors.systemGray6,
    },
    slide: {
      flex: 1,
      flexDirection: "row",
      flexWrap: "wrap",
    },
    image: {
      width: 60,
      aspectRatio: sectionName === "Movies" ? 2 / 3 : 3 / 4,
      borderRadius: 6,
      marginLeft: 16,
      marginTop: 8,
      marginBottom: 8,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Colors.separator,
    },
    middle: {
      borderColor: Colors.separator,
      borderBottomWidth: isLastInSection ? 0 : StyleSheet.hairlineWidth,
      flex: 1,
      justifyContent: "center",
      marginLeft: 16,
      paddingTop: 8,
      paddingBottom: 8,
    },
    countdown: {
      borderColor: Colors.separator,
      borderBottomWidth: isLastInSection ? 0 : StyleSheet.hairlineWidth,
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 8,
      paddingBottom: 8,
    },
  });

  let imageSrc = "";
  let title = "";
  if (sectionName === "Movies") {
    imageSrc = `https://image.tmdb.org/t/p/${PosterSizes.W300}${item!.poster_path}`;
    title = item!.title;
  }
  if (sectionName === "Games") {
    imageSrc = `https:${item!.game.cover.url.replace("thumb", "cover_big_2x")}`;
    title = item!.game.name;
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
        <Animated.View style={[{ justifyContent: "center" }, radioButtonStyle]}>
          <RadioButton isSelected={isSelected} />
        </Animated.View>
        <View
          style={{
            justifyContent: "center",
            // Extracted from Figma, decide to keep or not
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowRadius: 4,
            shadowColor: "rgba(0, 0, 0, 0.15)",
            shadowOpacity: 1,
          }}
        >
          <Image
            style={styles.image}
            source={{ uri: imageSrc }}
            contentFit="cover"
          />
        </View>
        <View style={styles.middle}>
          <Text
            style={[iOSUIKit.body, { color: Colors.label }]}
            numberOfLines={2}
          >
            {title}
          </Text>
          <Text style={[iOSUIKit.subhead, { color: Colors.secondaryLabel }]}>
            {getFormattedDate()}
          </Text>
        </View>
        <View style={styles.countdown}>
          <Text style={[iOSUIKit.bodyEmphasized, { color: Colors.systemBlue }]}>
            {getDaysUntil()}
          </Text>
          <Text style={[iOSUIKit.body, { color: Colors.systemBlue }]}>
            days
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}
