import * as Colors from "@bacons/apple-colors";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { iOSUIKit } from "react-native-typography";

import { useCountdownStore } from "@/stores";

import { useGameCountdowns } from "../api/getGameCountdowns";
import { useMovieCountdowns } from "../api/getMovieCountdowns";
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
  const {
    isEditing,
    movies: selectedMovies,
    games: selectedGames,
  } = useCountdownStore();

  const { imageSource, title, formattedDate, daysUntil, aspectRatio } =
    useCountdownItemData(item, sectionName);

  const { handlePress } = useCountdownItemNavigation(item, sectionName);

  const { slideStyle, radioButtonStyle } = useCountdownItemAnimation(isEditing);

  const documentId = getDocumentId(item, sectionName);
  const selectedItems = sectionName === "Movies" ? selectedMovies : selectedGames;
  const isSelected = selectedItems.includes(documentId);

  const styles = createCountdownItemStyles(
    isFirstInSection,
    isLastInSection,
    isSelected,
    aspectRatio,
  );

  return (
    <Pressable onPress={handlePress} style={styles.rowFront}>
      <Animated.View style={[styles.slide, slideStyle]}>
        <Animated.View style={[styles.radioButtonContainer, radioButtonStyle]}>
          <RadioButton isSelected={isSelected} />
        </Animated.View>
        <View style={staticCountdownItemStyles.posterShadow}>
          <Image
            style={styles.image}
            source={{ uri: imageSource }}
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
            {formattedDate}
          </Text>
        </View>
        <View style={styles.countdown}>
          <Text style={[iOSUIKit.bodyEmphasized, { color: Colors.systemBlue }]}>
            {daysUntil ?? "TBD"}
          </Text>
          <Text style={[iOSUIKit.body, { color: Colors.systemBlue }]}>
            days
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}
