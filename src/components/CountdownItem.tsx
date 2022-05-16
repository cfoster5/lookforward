import React, { useEffect } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { iOSColors, iOSUIKit } from "react-native-typography";
import Ionicons from "react-native-vector-icons/Ionicons";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { DateTime } from "luxon";

import { reusableStyles } from "../helpers/styles";
import { IGDB } from "../interfaces/igdb";
import { Navigation } from "../interfaces/navigation";
import { Movie } from "../interfaces/tmdb";

interface Props {
  navigation: CompositeNavigationProp<
    StackNavigationProp<Navigation.CountdownStackParamList, "Countdown">,
    BottomTabNavigationProp<Navigation.TabNavigationParamList, "CountdownTab">
  >;
  item: any;
  sectionName: "Movies" | "Games";
  isLastInSection: boolean;
  showButtons: boolean;
  selected: boolean;
  updateSelections: (documentID: string) => void;
}

function CountdownItem({
  navigation,
  item,
  sectionName,
  isLastInSection,
  showButtons,
  selected,
  updateSelections,
}: Props) {
  const transformAmount = useSharedValue(-24);

  useEffect(() => {
    if (showButtons) {
      transformAmount.value = withTiming(16);
    } else if (!showButtons) {
      transformAmount.value = withTiming(-24);
    }
  }, [showButtons]);

  function getReleaseDate(): string {
    if (sectionName === "Movies") {
      if (item.traktReleaseDate) {
        return DateTime.fromFormat(
          (item as Movie).traktReleaseDate,
          "yyyy-MM-dd"
        )
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
      if (item.traktReleaseDate) {
        const diff = DateTime.fromFormat(
          (item as Movie).traktReleaseDate,
          "yyyy-MM-dd"
        )
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

  function RadioButton(props: any) {
    return (
      <View
        style={[
          {
            height: 24,
            width: 24,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: iOSColors.gray,
            alignItems: "center",
            justifyContent: "center",
          },
          props.style,
        ]}
      >
        {props.selected ? (
          <View
            style={{
              height: 24,
              width: 24,
              borderRadius: 12,
              backgroundColor: iOSColors.blue,
              justifyContent: "center",
            }}
          >
            <Ionicons
              name="checkmark-outline"
              color={iOSColors.white}
              size={20}
              style={{ textAlign: "center" }}
            />
          </View>
        ) : null}
      </View>
    );
  }

  const styles = StyleSheet.create({
    rowFront: {
      overflow: "hidden",
      // backgroundColor: "#1f1f1f",
      backgroundColor: selected ? "#3a3a3c" : "#1f1f1f",
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
      borderColor: "#3c3d41",
      borderBottomWidth:
        sectionName === "Games" && isLastInSection
          ? 0
          : StyleSheet.hairlineWidth,
      flex: 1,
      justifyContent: "center",
      marginLeft: 16,
      paddingTop: 8,
      paddingBottom: 8,
    },
    countdown: {
      borderColor: "#3c3d41",
      borderBottomWidth:
        sectionName === "Games" && isLastInSection
          ? 0
          : StyleSheet.hairlineWidth,
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

  const slideStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          // translateX: transformAmount.value,
          translateX: interpolate(transformAmount.value, [-24, 16], [-24, 16]),
        },
      ],
    };
  });

  const radioButtonStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(transformAmount.value, [-24, 16], [0, 1]),
    };
  });

  return (
    // <Pressable onPress={() => showButtons ? updateSelections(item.documentID) : navigation.navigate('Details', { type: sectionName === "Movies" ? "movie" : "game", data: item })}>
    <Pressable
      onPress={() =>
        showButtons
          ? updateSelections(item.documentID)
          : sectionName === "Movies"
          ? navigation.navigate("Movie", { movie: item })
          : undefined
      }
    >
      <View style={styles.rowFront}>
        <Animated.View style={[styles.slide, slideStyle]}>
          <Animated.View
            style={[{ justifyContent: "center" }, radioButtonStyle]}
          >
            <RadioButton selected={selected} />
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
                color: iOSColors.blue,
              }}
            >
              {getCountdownDays()}
            </Text>
            <Text
              style={{ ...iOSUIKit.bodyWhiteObject, color: iOSColors.blue }}
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
