import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { iOSColors, iOSUIKit } from "react-native-typography";
import { TMDB } from "../../types";

interface Props {
  navigation: any;
  genre?: TMDB.Genre;
  company?: TMDB.ProductionCompany;
  keyword?: any;
}

export function TestButton({ navigation, genre, company, keyword }: Props) {
  let colorScheme = "dark";
  let obj = {};
  if (genre) {
    obj = genre
  }
  else if (company) {
    obj = company
  }
  else if (keyword) {
    obj = keyword
  }

  return (
    <Pressable
      onPress={() => navigation.push("MovieDiscover", { genre: obj })}
      style={{
        // backgroundColor: "rgb(91, 91, 96)",
        borderRadius: 16,
        borderWidth: StyleSheet.hairlineWidth,
        // borderColor: iOSColors.gray,
        borderColor: "rgb(91, 91, 96)",
        paddingHorizontal: 24,
        paddingVertical: 8,
        marginRight: 8,
        marginBottom: 16,
        justifyContent: "center"
      }}
    >
      <Text style={colorScheme === "dark" ? { ...iOSUIKit.footnoteEmphasizedObject, color: iOSColors.blue } : { ...iOSUIKit.bodyObject }}>{obj.name}</Text>
    </Pressable>
  )
}