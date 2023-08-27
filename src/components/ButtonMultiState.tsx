import { useContext } from "react";
import { Pressable, Text } from "react-native";
import { iOSUIKit } from "react-native-typography";

import TabStackContext from "../contexts/TabStackContext";

import { Colors } from "@/constants/Colors";

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
            ? Colors.gray4
            : undefined,
        borderColor: Colors.gray4,
        borderWidth: 1,
        borderRadius: 22,
        paddingHorizontal: 24,
        paddingVertical: 8,
        marginRight: 8,
        marginTop: 16,
        minHeight: 44,
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
