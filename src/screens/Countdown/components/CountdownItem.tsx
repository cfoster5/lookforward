import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { iOSUIKit } from "react-native-typography";

import { useCountdownStore } from "@/stores/countdown";
import { colors } from "@/theme/colors";

import { useGameCountdowns } from "../api/getGameCountdowns";
import { useMovieCountdowns } from "../api/getMovieCountdowns";
import { PersonCountdownData } from "../api/getPersonCountdowns";
import { useCountdownItemAnimation } from "../hooks/useCountdownItemAnimation";
import { useCountdownItemData } from "../hooks/useCountdownItemData";
import { useCountdownItemNavigation } from "../hooks/useCountdownItemNavigation";
import { countdownItemStyles } from "../styles/countdownItem.styles";
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

  const { radioButtonStyle, separatorStyle } =
    useCountdownItemAnimation(isEditing);

  const documentId = getDocumentId(item, sectionName);
  const selectedItems =
    sectionName === "Movies"
      ? selectedMovies
      : sectionName === "Games"
        ? selectedGames
        : selectedPeople;
  const isSelected = selectedItems.includes(documentId);

  const isCircular = sectionName === "People";
  const imageHeight = 60 / aspectRatio;
  const circularRadius = isCircular ? imageHeight / 2 : undefined;

  return (
    <Pressable
      onPress={handlePress}
      style={[
        countdownItemStyles.rowFront,
        isFirstInSection && countdownItemStyles.rowFrontFirst,
        isLastInSection && countdownItemStyles.rowFrontLast,
        isSelected && countdownItemStyles.rowFrontSelected,
      ]}
    >
      <View style={countdownItemStyles.row}>
        <Animated.View
          style={[countdownItemStyles.radioButtonContainer, radioButtonStyle]}
        >
          <RadioButton isSelected={isSelected} />
        </Animated.View>
        <View style={countdownItemStyles.posterShadow}>
          {imageSource ? (
            <Image
              style={[
                countdownItemStyles.image,
                { aspectRatio },
                isCircular && { borderRadius: circularRadius },
              ]}
              source={{ uri: imageSource }}
              contentFit="cover"
            />
          ) : (
            <View
              style={[
                countdownItemStyles.image,
                countdownItemStyles.imageFallback,
                { aspectRatio },
                isCircular && { borderRadius: circularRadius },
              ]}
            >
              <Text
                style={[
                  iOSUIKit.bodyEmphasized,
                  { color: colors.secondaryLabel, textAlign: "center" },
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
        <View style={countdownItemStyles.middle}>
          <Text
            style={[iOSUIKit.body, { color: colors.label }]}
            numberOfLines={2}
          >
            {title}
          </Text>
          <Text
            style={[iOSUIKit.subhead, { color: colors.secondaryLabel }]}
            numberOfLines={2}
          >
            {formattedDate}
          </Text>
        </View>
        <View style={countdownItemStyles.countdown}>
          {daysUntil !== null && daysUntil <= 0 ? (
            <Text style={[iOSUIKit.body, { color: colors.secondaryLabel }]}>
              Released
            </Text>
          ) : (
            <>
              <Text
                style={[iOSUIKit.bodyEmphasized, { color: colors.systemBlue }]}
              >
                {daysUntil ?? "TBD"}
              </Text>
              <Text style={[iOSUIKit.body, { color: colors.systemBlue }]}>
                days
              </Text>
            </>
          )}
        </View>
        <Animated.View
          style={[
            countdownItemStyles.separator,
            isLastInSection && countdownItemStyles.separatorHidden,
            separatorStyle,
          ]}
        />
      </View>
    </Pressable>
  );
}
