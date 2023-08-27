import { useContext } from "react";
import { Text, View } from "react-native";
import { iOSUIKit } from "react-native-typography";

import TabStackContext from "../../contexts/TabStackContext";
import { reusableStyles } from "../../helpers/styles";

import { Colors } from "@/constants/Colors";

export function TextPoster({ text, style }: { text: string; style?: any }) {
  const { theme } = useContext(TabStackContext);
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
        ...style,
      }}
    >
      <Text
        style={
          theme === "dark"
            ? { ...iOSUIKit.title3EmphasizedWhiteObject, textAlign: "center" }
            : {
                ...iOSUIKit.title3EmphasizedObject,
                color: Colors.gray,
                textAlign: "center",
              }
        }
      >
        {text}
      </Text>
    </View>
  );
}
