import React from "react";
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
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
  transformAnim: Animated.Value;
  opacityAnim: Animated.Value;
}

function CountdownItem({
  navigation,
  item,
  sectionName,
  isLastInSection,
  showButtons,
  selected,
  updateSelections,
  transformAnim,
  opacityAnim,
}: Props) {
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

  const SlideView = ({
    children,
    style,
  }: {
    children: any;
    style: { flex: number; flexDirection: "row"; flexWrap: "wrap" };
  }) => {
    return (
      <Animated.View
        style={{
          ...style,
          transform: [{ translateX: transformAnim }],
        }}
      >
        {children}
      </Animated.View>
    );
  };

  const FadeView = ({
    children,
    style,
  }: {
    children: any;
    style: { justifyContent: "center" };
  }) => {
    return (
      <Animated.View
        style={{
          ...style,
          opacity: opacityAnim,
        }}
      >
        {children}
      </Animated.View>
    );
  };

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

  return (
    // <Pressable onPress={() => showButtons ? updateSelections(item.documentID) : navigation.navigate('Details', { type: sectionName === "Movies" ? "movie" : "game", data: item })}>
    <Pressable
      onPress={() =>
        showButtons
          ? updateSelections(item.documentID)
          : sectionName === "Movies"
          ? navigation.navigate("Details", { movie: item })
          : undefined
      }
    >
      <View style={styles.rowFront}>
        <SlideView style={styles.slide}>
          <FadeView style={{ justifyContent: "center" }}>
            <RadioButton selected={selected} />
          </FadeView>
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
        </SlideView>
      </View>
    </Pressable>
  );
}

export default CountdownItem;
