import { StackNavigationProp } from "@react-navigation/stack";
import React, { useContext, useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { iOSColors, iOSUIKit } from "react-native-typography";
import { reusableStyles } from "../helpers/styles";
import { Navigation, TMDB } from "../../types";
import ThemeContext from "../contexts/ThemeContext";
import FastImage from "react-native-fast-image";

interface Props {
  navigation: StackNavigationProp<Navigation.FindStackParamList, "Details">,
  person: TMDB.Movie.Crew | TMDB.Movie.Cast;
}

function Person({ navigation, person }: Props) {
  const colorScheme = useContext(ThemeContext)
  return (
    <Pressable style={{ flex: 1, flexDirection: 'row', alignItems: "center" }} onPress={() => navigation.push("Actor", person)}>
      {person.profile_path &&
        <FastImage
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
          {person.character ? (person as TMDB.Movie.Cast).character : (person as TMDB.Movie.Crew).job}
        </Text>
      </View>
    </Pressable>
  )
}

export default Person;