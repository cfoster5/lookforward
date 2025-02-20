import { useEffect } from "react";
import { Image } from "expo-image";
import { PlatformColor, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { iOSUIKit } from "react-native-typography";
import { PosterSizes } from "tmdb-ts";

import { RadioButton } from "./RadioButton";

import { reusableStyles } from "@/helpers/styles";
import { isoToUTC, now, timestampToUTC } from "@/utils/dates";
import { useMovieCountdowns } from "../api/getMovieCountdowns";
import { useGameCountdowns } from "../api/getGameCountdowns";
import { useCountdownStore } from "@/stores/store";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { CountdownStackParamList } from "@/types/navigation";

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
};

export function CountdownItem({ item, sectionName, isLastInSection }: Props) {
  const {
    showDeleteButton,
    movies: selectedMovies,
    games: selectedGames,
    toggleSelection,
  } = useCountdownStore();
  const navigation = useNavigation<NavigationProp<CountdownStackParamList>>();
  const transformAmount = useSharedValue(-24);

  useEffect(() => {
    transformAmount.value = withTiming(!showDeleteButton ? -24 : 16);
  }, [showDeleteButton, transformAmount]);

  const isSelected =
    sectionName === "Movies"
      ? selectedMovies.includes(item!.documentID)
      : selectedGames.includes(item!.id.toString());

  function getReleaseDate(): string {
    if (sectionName === "Movies") {
      if (item!.releaseDate) {
        return isoToUTC(item!.releaseDate).toFormat("MM/dd/yyyy");
      } else {
        return "No release date yet";
      }
    } else {
      if (item!.date) {
        return timestampToUTC(item!.date).toFormat("MM/dd/yyyy");
      } else {
        return item!.human;
      }
    }
  }

  function getCountdownDays(): number | "∞" {
    if (sectionName === "Movies") {
      if (item!.releaseDate) {
        const diff = isoToUTC(item!.releaseDate).diff(now);
        return Math.ceil(diff.as("days"));
      } else {
        return "∞";
      }
    } else {
      if (item!.date) {
        const diff = timestampToUTC(item!.date).diff(now);
        return Math.ceil(diff.as("days"));
      } else {
        return "∞";
      }
    }
  }

  function handlePress() {
    if (sectionName === "Movies") handleMovieAction();
    else if (sectionName === "Games") handleGameAction();
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
      },
    });
  }

  const styles = StyleSheet.create({
    rowFront: {
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
      width: 92 / 1.75,
      height: 132 / 1.75,
      borderRadius: 12,
      marginLeft: 16,
      marginTop: 8,
      marginBottom: 8,
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
  });

  let imageSrc = "";
  let title = "";
  if (sectionName === "Movies") {
    imageSrc = `https://image.tmdb.org/t/p/${PosterSizes.W92}${item!.poster_path}`;
    title = item!.title;
  }
  if (sectionName === "Games") {
    imageSrc = `https:${item!.game.cover.url.replace("thumb", "cover_big_2x")}`;
    title = item!.game.name;
  }

  const slideStyle = useAnimatedStyle(() => ({
    transform: [
      {
        // translateX: transformAmount.value,
        translateX: interpolate(transformAmount.value, [-24, 16], [-24, 16]),
      },
    ],
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
        <View style={{ justifyContent: "center" }}>
          <Image
            style={styles.image}
            source={{ uri: imageSrc }}
            contentFit="cover"
          />
        </View>
        <View style={styles.middle}>
          <Text style={{ ...iOSUIKit.bodyWhiteObject }}>{title}</Text>
          <Text style={{ ...reusableStyles.date }}>{getReleaseDate()}</Text>
        </View>
        <View style={styles.countdown}>
          <Text
            style={{
              ...iOSUIKit.title3EmphasizedWhiteObject,
              color: PlatformColor("systemBlue"),
            }}
          >
            {getCountdownDays()}
          </Text>
          <Text
            style={{
              ...iOSUIKit.bodyWhiteObject,
              color: PlatformColor("systemBlue"),
            }}
          >
            days
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}
