import { reusableStyles } from "helpers/styles";
import { IGDB } from "interfaces/igdb";
import { DateTime } from "luxon";
import React from "react";
import {
  Image,
  PlatformColor,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { iOSUIKit } from "react-native-typography";

import { RadioButton } from "./RadioButton";

interface Props {
  item: any;
  sectionName: "Movies" | "Games";
  isLastInSection: boolean;
  showButtons: boolean;
  isSelected: boolean;
  handlePress: () => void;
}

function CountdownItem({
  item,
  sectionName,
  isLastInSection,
  showButtons,
  isSelected,
  handlePress,
}: Props) {
  const transformAmount = useSharedValue(-24);
  transformAmount.value = withTiming(!showButtons ? -24 : 16);

  function getReleaseDate(): string {
    if (sectionName === "Movies") {
      if (item.releaseDate) {
        return DateTime.fromISO(item.releaseDate)
          .toUTC()
          .toFormat("MM/dd/yyyy");
      } else {
        return "No release date yet";
      }
    } else {
      return DateTime.fromSeconds((item as IGDB.ReleaseDate.ReleaseDate).date)
        .toUTC()
        .toFormat("MM/dd/yyyy");
    }
  }

  function getCountdownDays(): number {
    if (sectionName === "Movies") {
      if (item.releaseDate) {
        const diff = DateTime.fromISO(item.releaseDate)
          .diff(DateTime.now(), ["days"])
          .toObject();
        return Math.ceil(diff.days);
      } else {
        return "∞";
      }
    } else {
      const diff = DateTime.fromSeconds(
        (item as IGDB.ReleaseDate.ReleaseDate).date
      )
        .diff(DateTime.now(), ["days"])
        .toObject();

      return Math.ceil(diff.days);
    }
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
      borderRadius: 8,
      resizeMode: "cover",
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
    imageSrc = `https://image.tmdb.org/t/p/w92${item.poster_path}`;
    title = item.title;
  }
  if (sectionName === "Games") {
    imageSrc = `https:${item.game.cover.url.replace("thumb", "cover_big_2x")}`;
    title = item.game.name;
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
    <Pressable onPress={handlePress}>
      <View style={styles.rowFront}>
        <Animated.View style={[styles.slide, slideStyle]}>
          <Animated.View
            style={[{ justifyContent: "center" }, radioButtonStyle]}
          >
            <RadioButton isSelected={isSelected} />
          </Animated.View>
          <View style={{ justifyContent: "center" }}>
            <Image style={styles.image} source={{ uri: imageSrc }} />
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
      </View>
    </Pressable>
  );
}

export default CountdownItem;
