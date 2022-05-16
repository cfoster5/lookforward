import React, { useContext, useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import FastImage from "react-native-fast-image";
import { iOSColors, iOSUIKit } from "react-native-typography";
import { StackNavigationProp } from "@react-navigation/stack";

import TabStackContext from "../contexts/TabStackContext";
import { reusableStyles } from "../helpers/styles";
import { Navigation } from "../interfaces/navigation";
import { TMDB } from "../interfaces/tmdb";
import { TextPoster } from "./Posters/TextPoster";

interface Props {
  navigation: StackNavigationProp<Navigation.FindStackParamList, "Details">;
  person: TMDB.Crew | TMDB.Cast;
}

function Person({ navigation, person }: Props) {
  const { theme } = useContext(TabStackContext);
  return (
    <Pressable
      style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
      onPress={() => navigation.push("Actor", { personId: person.id })}
    >
      {person.profile_path && (
        <FastImage
          style={reusableStyles.credit}
          source={{
            uri: `https://image.tmdb.org/t/p/w300${person.profile_path}`,
          }}
        />
      )}
      {!person.profile_path && (
        <TextPoster
          text={person.name
            .split(" ")
            .map((i: string) => i.charAt(0))
            .join("")}
          style={reusableStyles.credit}
        />
      )}
      <View style={{ marginLeft: 16 }}>
        <Text style={theme === "dark" ? iOSUIKit.bodyWhite : iOSUIKit.body}>
          {person.name}
        </Text>
        <Text
          style={
            theme === "dark"
              ? {
                  ...iOSUIKit.subheadEmphasizedWhiteObject,
                  color: iOSColors.gray,
                }
              : { ...iOSUIKit.subheadEmphasizedObject, color: iOSColors.gray }
          }
        >
          {"character" in person
            ? (person as TMDB.Cast).character
            : (person as TMDB.Crew).job}
        </Text>
      </View>
    </Pressable>
  );
}

export default Person;
