import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { TMDB } from "interfaces/tmdb";
import { useContext, useEffect } from "react";
import {
  Dimensions,
  PlatformColor,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import FastImage from "react-native-fast-image";
import { iOSColors, iOSUIKit } from "react-native-typography";

import TabStackContext from "@/contexts/TabStackContext";
import { calculateWidth } from "@/helpers/helpers";
import { reusableStyles } from "@/helpers/styles";
import { FindStackParamList, TabNavigationParamList } from "@/types";

interface Props {
  navigation: CompositeNavigationProp<
    StackNavigationProp<FindStackParamList, "Find">,
    BottomTabNavigationProp<TabNavigationParamList, "FindTab">
  >;
  person: TMDB.Crew | TMDB.Cast;
}

function SearchPerson({ navigation, person }: Props) {
  const { theme } = useContext(TabStackContext);
  return (
    <Pressable
      onPress={() =>
        navigation.push("Actor", {
          personId: person.id,
          name: person.name,
          profile_path: person.profile_path,
        })
      }
    >
      {person.profile_path && (
        <FastImage
          style={styles.searchCredit}
          source={{
            uri: `https://image.tmdb.org/t/p/w300${person.profile_path}`,
          }}
        />
      )}
      {!person.profile_path && (
        <View
          style={{
            ...styles.searchCredit,
            borderWidth: 1,
            borderColor:
              theme === "dark" ? PlatformColor("systemGray6") : "white",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={
              theme === "dark"
                ? { ...iOSUIKit.title3EmphasizedWhiteObject }
                : {
                    ...iOSUIKit.title3EmphasizedObject,
                    color: PlatformColor("systemGray"),
                  }
            }
          >
            {person.name.split(" ").map((i: string) => i.charAt(0))}
          </Text>
        </View>
      )}
      <Text
        style={
          theme === "dark"
            ? {
                ...reusableStyles.date,
                maxWidth: styles.searchCredit.width,
                textAlign: "center",
              }
            : iOSUIKit.body
        }
      >
        {person.name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  searchCredit: {
    // I don't know why 18 works here to center the right-most image but it works on every iOS device tested
    width: calculateWidth(16, 16, 3.5),
    height: calculateWidth(16, 16, 3.5) * 1.5,
    borderRadius: 8,
    marginBottom: 8,
  },
});

export default SearchPerson;
