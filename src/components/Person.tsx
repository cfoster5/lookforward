import React, { useContext, useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import FastImage from "react-native-fast-image";
import { iOSColors, iOSUIKit } from "react-native-typography";
import { StackNavigationProp } from "@react-navigation/stack";

import TabStackContext from "../contexts/TabStackContext";
import { reusableStyles } from "../helpers/styles";
import { Navigation } from "../interfaces/navigation";
import { Cast, Crew } from "../interfaces/tmdb";

interface Props {
  navigation: StackNavigationProp<Navigation.FindStackParamList, "Details">;
  person: Crew | Cast;
}

function Person({ navigation, person }: Props) {
  const { theme } = useContext(TabStackContext);
  return (
    <Pressable
      style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
      onPress={() => navigation.push("Actor", person)}
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
        <View
          style={{
            ...reusableStyles.credit,
            borderWidth: 1,
            borderColor: theme === "dark" ? "#1f1f1f" : "white",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={
              theme === "dark"
                ? { ...iOSUIKit.title3EmphasizedWhiteObject }
                : { ...iOSUIKit.title3EmphasizedObject, color: iOSColors.gray }
            }
          >
            {person.name.split(" ").map((i: string) => i.charAt(0))}
          </Text>
        </View>
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
            ? (person as Cast).character
            : (person as Crew).job}
        </Text>
      </View>
    </Pressable>
  );
}

export default Person;
