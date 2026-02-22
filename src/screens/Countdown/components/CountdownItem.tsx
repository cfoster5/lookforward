import { Image } from "expo-image";
import { Color } from "expo-router";
import { Pressable, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { iOSUIKit } from "react-native-typography";

import { useCountdownStore } from "@/stores";

import { useGameCountdowns } from "../api/getGameCountdowns";
import { useMovieCountdowns } from "../api/getMovieCountdowns";
import { PersonCountdownData } from "../api/getPersonCountdowns";
import { useCountdownItemAnimation } from "../hooks/useCountdownItemAnimation";
import { useCountdownItemData } from "../hooks/useCountdownItemData";
import { useCountdownItemNavigation } from "../hooks/useCountdownItemNavigation";
import {
  createCountdownItemStyles,
  staticCountdownItemStyles,
} from "../styles/countdownItem.styles";
import { getDocumentId } from "../utils/countdownItemHelpers";

import { RadioButton } from "./RadioButton";

interface MovieProps {
  item: ReturnType<typeof useMovieCountdowns>[number]["data"];
  sectionName: "Movies";
}

interface GameProps {
  item: ReturnType<typeof useGameCountdowns>[number]["data"];
  sectionName: "Games";
}

interface PersonProps {
  item: PersonCountdownData;
  sectionName: "People";
}

type Props = (MovieProps | GameProps | PersonProps) & {
  isLastInSection: boolean;
  isFirstInSection: boolean;
};

export function CountdownItem({
  item,
  sectionName,
  isLastInSection,
  isFirstInSection,
}: Props) {
  const {
    isEditing,
    movies: selectedMovies,
    games: selectedGames,
    people: selectedPeople,
  } = useCountdownStore();

  const { imageSource, title, formattedDate, daysUntil, aspectRatio } =
    useCountdownItemData(item, sectionName);

  const { handlePress } = useCountdownItemNavigation(item, sectionName);

  const { slideStyle, radioButtonStyle } = useCountdownItemAnimation(isEditing);

  const documentId = getDocumentId(item, sectionName);
  const selectedItems =
    sectionName === "Movies"
      ? selectedMovies
      : sectionName === "Games"
        ? selectedGames
        : selectedPeople;
  const isSelected = selectedItems.includes(documentId);

  const styles = createCountdownItemStyles(
    isFirstInSection,
    isLastInSection,
    isSelected,
    aspectRatio,
  );

  const isCircular = sectionName === "People";
  const imageHeight = 60 / aspectRatio;

  return (
    <Pressable onPress={handlePress} style={styles.rowFront}>
      <Animated.View style={[styles.slide, slideStyle]}>
        <Animated.View style={[styles.radioButtonContainer, radioButtonStyle]}>
          <RadioButton isSelected={isSelected} />
        </Animated.View>
        <View style={staticCountdownItemStyles.posterShadow}>
          {imageSource ? (
            <Image
              style={[
                styles.image,
                isCircular && { borderRadius: imageHeight / 2 },
              ]}
              source={{ uri: imageSource }}
              contentFit="cover"
            />
          ) : (
            <View
              style={[
                styles.image,
                isCircular && { borderRadius: imageHeight / 2 },
                {
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: Color.ios.tertiarySystemFill as string,
                },
              ]}
            >
              <Text
                style={[
                  iOSUIKit.bodyEmphasized,
                  { color: Color.ios.secondaryLabel, textAlign: "center" },
                ]}
              >
                {title
                  .split(" ")
                  .map((word: string) => word.charAt(0))
                  .join("")}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.middle}>
          <Text
            style={[iOSUIKit.body, { color: Color.ios.label }]}
            numberOfLines={2}
          >
            {title}
          </Text>
          <Text
            style={[iOSUIKit.subhead, { color: Color.ios.secondaryLabel }]}
            numberOfLines={2}
          >
            {formattedDate}
          </Text>
        </View>
        <View style={styles.countdown}>
          {daysUntil !== null && daysUntil <= 0 ? (
            <Text style={[iOSUIKit.body, { color: Color.ios.secondaryLabel }]}>
              Released
            </Text>
          ) : (
            <>
              <Text
                style={[
                  iOSUIKit.bodyEmphasized,
                  { color: Color.ios.systemBlue },
                ]}
              >
                {daysUntil ?? "TBD"}
              </Text>
              <Text style={[iOSUIKit.body, { color: Color.ios.systemBlue }]}>
                days
              </Text>
            </>
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
}
