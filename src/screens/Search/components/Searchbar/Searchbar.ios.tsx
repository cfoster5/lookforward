import TabStackContext from "@/contexts/TabStackContext";
import React, { useContext } from "react";
import { PlatformColor } from "react-native";
import { SearchBar } from "react-native-elements";
import { iOSUIKit } from "react-native-typography";

interface Props {
  categoryIndex: number;
  handleChange: (text: string) => void;
  value: string;
}

export function Searchbar({ categoryIndex, handleChange, value }: Props) {
  const { theme } = useContext(TabStackContext);
  return (
    <SearchBar
      cancelIcon={{ color: "white" }}
      clearIcon={{ color: PlatformColor("systemGray") }}
      containerStyle={
        theme === "dark"
          ? {
              backgroundColor: "black",
              marginHorizontal: 8,
              paddingVertical: 16,
            }
          : { marginHorizontal: 8 }
      }
      inputContainerStyle={
        theme === "dark"
          ? {
              backgroundColor: PlatformColor("secondarySystemBackground"),
              height: 36,
            }
          : {}
      }
      placeholderTextColor={
        theme === "dark" ? PlatformColor("systemGray") : undefined
      }
      searchIcon={
        theme === "dark" ? { color: PlatformColor("systemGray") } : {}
      }
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
      onChangeText={handleChange}
      value={value}
      platform="ios"
    />
  );
}

export default Searchbar;
