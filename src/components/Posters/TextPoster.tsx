import * as Colors from "@bacons/apple-colors";
import { Text, View } from "react-native";
import { iOSUIKit } from "react-native-typography";

import { useInterfaceStore } from "@/stores";

import { reusableStyles } from "../../helpers/styles";

export function TextPoster({ text, style }: { text: string; style?: any }) {
  const { theme } = useInterfaceStore();
  return (
    <View
      style={{
        ...reusableStyles.gamePoster,
        // borderWidth: 1,
        borderColor: Colors.separator,
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
                color: Colors.systemGray,
                textAlign: "center",
              }
        }
      >
        {text}
      </Text>
    </View>
  );
}
