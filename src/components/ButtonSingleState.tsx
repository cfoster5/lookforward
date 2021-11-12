import React, { useContext } from "react";
import { Pressable, Text } from "react-native";
import { iOSUIKit } from "react-native-typography";

import ThemeContext from "../contexts/ThemeContext";

export default function ButtonSingleState({
  text,
  onPress,
}: {
  text: string;
  onPress: any;
}) {
  const colorScheme = useContext(ThemeContext);
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: "rgb(91, 91, 96)",
        borderColor: "rgb(91, 91, 96)",
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
          colorScheme === "dark"
            ? { ...iOSUIKit.footnoteEmphasizedObject, color: "white" }
            : { ...iOSUIKit.bodyObject }
        }
      >
        {text}
      </Text>
    </Pressable>
  );
}
