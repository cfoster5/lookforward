import { PlatformColor, Text, View } from "react-native";
import { iOSUIKit } from "react-native-typography";

import { useStore } from "@/stores/store";

import { reusableStyles } from "../../helpers/styles";

export function TextPoster({ text, style }: { text: string; style?: any }) {
  const { theme } = useStore();
  return (
    <View
      style={{
        ...reusableStyles.gamePoster,
        // borderWidth: 1,
        borderColor: PlatformColor("separator"),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        aspectRatio: 3 / 4,
        padding: 16,
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
