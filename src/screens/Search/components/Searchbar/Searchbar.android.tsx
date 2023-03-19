import React from "react";
import { Pressable, Text, View } from "react-native";
import { iOSUIKit } from "react-native-typography";

interface Props {
  buttons: string[];
  categoryIndex: number;
  handleCategoryChange: (index: number) => void;
}

function Searchbar({ buttons, categoryIndex, handleCategoryChange }: Props) {
  return (
    <SearchBar
      cancelIcon={{ color: "white" }}
      clearIcon={
        Platform.OS === "android"
          ? { color: "white" }
          : { color: PlatformColor("systemGray") }
      }
      containerStyle={
        theme === "dark"
          ? {
              backgroundColor: "black",
              marginHorizontal: Platform.OS === "ios" ? 8 : 16,
              paddingVertical: 16,
            }
          : { marginHorizontal: 8 }
      }
      inputContainerStyle={
        theme === "dark"
          ? Platform.OS === "android"
            ? {
                backgroundColor: "rgb(28, 28, 31)",
                height: 36,
                borderRadius: 8,
              }
            : {
                backgroundColor: PlatformColor("secondarySystemBackground"),
                height: 36,
              }
          : {}
      }
      // placeholderTextColor={theme === "dark" ? "#999999" : undefined}
      placeholderTextColor={
        theme === "dark" ? PlatformColor("systemGray") : undefined
      }
      // searchIcon={theme === "dark" ? { color: "#999999" } : {}}
      searchIcon={
        theme === "dark" ? { color: PlatformColor("systemGray") } : {}
      }
      // inputStyle={theme === "dark" ? { color: "white" } : {}}
      leftIconContainerStyle={{ marginLeft: 6 }}
      inputStyle={
        theme === "dark" ? { ...iOSUIKit.bodyWhiteObject, marginLeft: 0 } : {}
      }
      cancelButtonProps={
        theme === "dark"
          ? {
              buttonTextStyle: {
                color: PlatformColor("systemBlue"),
                fontSize: iOSUIKit.bodyObject.fontSize,
                lineHeight: iOSUIKit.bodyObject.lineHeight,
              },
            }
          : {}
      }
      placeholder={categoryIndex === 0 ? "Movies & People" : "Search"}
      onChangeText={(text) =>
        dispatch({ type: "set-searchValue", searchValue: text })
      }
      value={searchValue}
      platform={Platform.OS === "ios" ? "ios" : "android"}
    />
  );
}

export default Searchbar;
