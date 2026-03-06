import { Dimensions, StyleSheet } from "react-native";
import { iOSUIKit } from "react-native-typography";

import { colors } from "@/theme/colors";

export const reusableStyles = StyleSheet.create({
  gamePoster: {
    // Setting flex zooms in width and stretches height to fit remaining space
    flex: 1,
    width: Dimensions.get("window").width / 2 - 24, // is 50% of container width
    borderRadius: 12,
    resizeMode: "cover",
    borderWidth: 1,
    borderColor: colors.separator,
  },
  date: {
    ...iOSUIKit.footnoteEmphasizedObject,
    color: colors.systemGray,
  },
  textInput: {
    ...iOSUIKit.bodyObject,
    backgroundColor: colors.systemGray6,
    color: colors.label,
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
  },
});
