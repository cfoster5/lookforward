import { useContext } from "react";
import { PlatformColor, Text, View } from "react-native";
import { iOSColors, iOSUIKit } from "react-native-typography";

import TabStackContext from "../../contexts/TabStackContext";
import { reusableStyles } from "../../helpers/styles";

export function TextPoster({ text, style }: { text: string; style?: any }) {
  const { theme } = useContext(TabStackContext);
  return (
    <View
      style={{
        ...reusableStyles.itemRight,
        // borderWidth: 1,
        borderColor:
          theme === "dark" ? PlatformColor("systemGray6") : "#e0e0e0",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      <Text
        style={
          theme === "dark"
            ? { ...iOSUIKit.title3EmphasizedWhiteObject, textAlign: "center" }
            : {
                ...iOSUIKit.title3EmphasizedObject,
                color: PlatformColor("systemGray"),
                textAlign: "center",
              }
        }
      >
        {text}
      </Text>
    </View>
  );
}
