import { StackNavigationProp } from "@react-navigation/stack";
import React, { useContext, useEffect } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { iOSColors, iOSUIKit } from "react-native-typography";
import { reusableStyles } from "../helpers/styles";
import { Navigation, TMDB } from "../../types";
import ThemeContext from "../contexts/ThemeContext";

interface Props {
  navigation: StackNavigationProp<Navigation.FindStackParamList, "Details">,
  profilePath: string | undefined;
  name: string;
  job: string | undefined;
  character: string | undefined;
}

function Person({ navigation, profilePath, name, job, character }: Props) {
  const colorScheme = useContext(ThemeContext)
  return (
    <Pressable style={{ flex: 1, flexDirection: 'row', alignItems: "center" }}>
      {profilePath &&
        <Image
          style={reusableStyles.credit}
          source={{ uri: `https://image.tmdb.org/t/p/w300${profilePath}` }}
        />
      }
      {!profilePath &&
        <View style={{
          ...reusableStyles.credit,
          borderWidth: 1,
          borderColor: colorScheme === "dark" ? "#1f1f1f" : "white",
          flexDirection: 'row',
          alignItems: "center",
          justifyContent: 'center'
        }}>
          <Text style={colorScheme === "dark" ? { ...iOSUIKit.title3EmphasizedWhiteObject } : { ...iOSUIKit.title3EmphasizedObject, color: iOSColors.gray }}>
            {name.split(' ').map((i: string) => i.charAt(0))}
          </Text>
        </View>
      }
      <View style={{ marginLeft: 16 }}>
        <Text style={colorScheme === "dark" ? iOSUIKit.bodyWhite : iOSUIKit.body}>{name}</Text>
        <Text style={colorScheme === "dark" ? { ...iOSUIKit.subheadEmphasizedWhiteObject, color: iOSColors.gray } : { ...iOSUIKit.subheadEmphasizedObject, color: iOSColors.gray }}>
          {character ? character : job}
        </Text>
      </View>
    </Pressable>
  )
}

export default Person;