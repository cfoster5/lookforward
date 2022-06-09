import React, { useContext } from "react";
import { Pressable, Text } from "react-native";
import { iOSUIKit } from "react-native-typography";
import Ionicons from "react-native-vector-icons/Ionicons";

import TabStackContext from "../contexts/TabStackContext";

export default function ButtonMultiState({
  text,
  selectedVal,
  onPress,
  test,
  children,
}: {
  text: string;
  selectedVal: string | number;
  onPress: any;
  test?: any;
  children?: any;
}) {
  const { theme } = useContext(TabStackContext);
  return (
    <Pressable
      onPress={onPress}
      style={{
        // Below colors extracted from Apple Fitness category buttons
        backgroundColor:
          selectedVal === (test !== undefined ? test : text)
            ? "rgb(53, 53, 53)"
            : undefined,
        borderColor: "rgb(53, 53, 53)",
        borderWidth: 1,
        borderRadius: 16,
        paddingHorizontal: 24,
        paddingVertical: 8,
        marginRight: 8,
        marginTop: 16,
        justifyContent: "center",
      }}
    >
      <Text
        style={
          theme === "dark"
            ? { ...iOSUIKit.footnoteEmphasizedObject, color: "white" }
            : { ...iOSUIKit.bodyObject }
        }
      >
        {text}
        {children}
        {/* <Ionicons name={method.direction === "Up" ? "arrow-up" : "arrow-down"} color="white" /> */}
      </Text>
    </Pressable>
  );
}
