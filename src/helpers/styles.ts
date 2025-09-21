import * as Colors from "@bacons/apple-colors";
import { Dimensions, StyleSheet } from "react-native";
import { iOSUIKit } from "react-native-typography";

export const reusableStyles = StyleSheet.create({
  gamePoster: {
    // Setting flex zooms in width and stretches height to fit remaining space
    flex: 1,
    width: Dimensions.get("window").width / 2 - 24, // is 50% of container width
    borderRadius: 12,
    resizeMode: "cover",
    borderWidth: 1,
    borderColor: Colors.separator,
  },
  date: {
    ...iOSUIKit.footnoteEmphasizedObject,
    color: Colors.systemGray,
  },
});
