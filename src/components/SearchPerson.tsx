import { StackNavigationProp } from "@react-navigation/stack";
import React, { useContext, useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { iOSColors, iOSUIKit } from "react-native-typography";
import { reusableStyles } from "../helpers/styles";
import ThemeContext from "../contexts/ThemeContext";
import FastImage from "react-native-fast-image";
import { Navigation } from "../interfaces/navigation";
import { TMDB } from "../interfaces/tmdb";

interface Props {
  navigation: StackNavigationProp<Navigation.FindStackParamList, "Details">,
  person: TMDB.Movie.Crew | TMDB.Movie.Cast;
}

function SearchPerson({ navigation, person }: Props) {
  const colorScheme = useContext(ThemeContext)
  return (
    <Pressable style={{ marginRight: 16 }} onPress={() => navigation.push("Actor", person)}>
      {person.profile_path &&
        <FastImage
          style={reusableStyles.searchCredit}
          source={{ uri: `https://image.tmdb.org/t/p/w300${person.profile_path}` }}
        />
      }
      {!person.profile_path &&
        <View style={{
          ...reusableStyles.searchCredit,
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
      <Text style={colorScheme === "dark" ? { ...reusableStyles.date, maxWidth: reusableStyles.searchCredit.width, textAlign: "center" } : iOSUIKit.body}>{person.name}</Text>
    </Pressable>
  )
}

export default SearchPerson;