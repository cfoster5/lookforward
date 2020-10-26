import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Appearance, Image, Pressable, Text, View } from "react-native";
import { iOSColors, iOSUIKit } from "react-native-typography";
import { reusableStyles } from "../helpers/styles";
import { Navigation, TMDB } from "../../types";

interface Props {
  navigation: StackNavigationProp<Navigation.HomeStackParamList, "Details">,
  type: "cast" | "crew",
  person: TMDB.Movie.Cast | TMDB.Movie.Crew
}

function Person({ navigation, type, person }: Props) {
  // const colorScheme = Appearance.getColorScheme();
  const colorScheme = "dark"
  return (
    <Pressable style={{ flex: 1, flexDirection: 'row', alignItems: "center" }}>
      {person.profile_path &&
        <Image
          style={reusableStyles.credit}
          source={{ uri: `https://image.tmdb.org/t/p/w300${person.profile_path}` }}
        />
      }
      {!person.profile_path &&
        <View style={{
          ...reusableStyles.credit,
          borderWidth: 1,
          borderColor: colorScheme === "dark" ? "#1f1f1f" : "white",
          flexDirection: 'row',
          alignItems: "center",
          justifyContent: 'center'
        }}>
          <Text style={colorScheme === "dark" ? { ...iOSUIKit.title3EmphasizedWhiteObject } : { ...iOSUIKit.title3EmphasizedObject, color: iOSColors.gray }}>
            {person.name.split(' ').map((i: string) => i.charAt(0))}
          </Text>
        </View>
      }
      <View style={{ marginLeft: 16 }}>
        <Text style={colorScheme === "dark" ? iOSUIKit.bodyWhite : iOSUIKit.body}>{person.name}</Text>
        <Text style={colorScheme === "dark" ? { ...iOSUIKit.subheadEmphasizedWhiteObject, color: iOSColors.gray } : { ...iOSUIKit.subheadEmphasizedObject, color: iOSColors.gray }}>
          {type === "cast" ? (person as TMDB.Movie.Cast).character : (person as TMDB.Movie.Crew).job}
        </Text>
      </View>
    </Pressable>
  )
}

export default Person;