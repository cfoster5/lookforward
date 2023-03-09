import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { TextPoster } from "components/Posters/TextPoster";
import TabStackContext from "contexts/TabStackContext";
import { Cast, Crew } from "interfaces/tmdb";
import React, { useContext } from "react";
import {
  PlatformColor,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import FastImage from "react-native-fast-image";
import { iOSColors, iOSUIKit } from "react-native-typography";

import {
  CountdownStackParamList,
  FindStackParamList,
  TabNavigationParamList,
} from "@/types";

interface Props {
  navigation:
    | CompositeNavigationProp<
        StackNavigationProp<FindStackParamList, "Movie">,
        BottomTabNavigationProp<TabNavigationParamList, "FindTab">
      >
    | CompositeNavigationProp<
        StackNavigationProp<CountdownStackParamList, "Movie">,
        BottomTabNavigationProp<TabNavigationParamList, "CountdownTab">
      >;
  person: Cast | Crew;
}

function Person({ navigation, person }: Props) {
  const { theme } = useContext(TabStackContext);
  const { width: windowWidth } = useWindowDimensions();

  const styles = StyleSheet.create({
    poster: {
      width: windowWidth / 3.5 - 16,
      height: (windowWidth / 3.5 - 16) * 1.5,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme === "dark" ? PlatformColor("systemGray6") : "#e0e0e0",
    },
  });

  return (
    <Pressable
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        marginTop: 16,
      }}
      onPress={() => navigation.push("Actor", { personId: person.id })}
    >
      {person.profile_path ? (
        <FastImage
          style={styles.poster}
          source={{
            uri: `https://image.tmdb.org/t/p/w300${person.profile_path}`,
          }}
        />
      ) : (
        <TextPoster
          text={person.name
            .split(" ")
            .map((i: string) => i.charAt(0))
            .join("")}
          style={styles.poster}
        />
      )}
      <View style={{ marginLeft: 16, flex: 1 }}>
        <Text style={theme === "dark" ? iOSUIKit.bodyWhite : iOSUIKit.body}>
          {person.name}
        </Text>
        <Text
          style={[iOSUIKit.callout, { color: PlatformColor("systemGray") }]}
        >
          {"character" in person ? person.character : person.job}
        </Text>
      </View>
    </Pressable>
  );
}

export default Person;
