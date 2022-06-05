import { Appearance, Dimensions, StyleSheet } from "react-native";
import { iOSColors, iOSUIKit } from "react-native-typography";

// const colorScheme = Appearance.getColorScheme();
const colorScheme = "dark";

export const reusableStyles = StyleSheet.create({
  itemRight: {
    width: Dimensions.get("window").width / 2 - 24, // is 50% of container width
    height: (Dimensions.get("window").width / 2 - 24) * 1.5,
    borderRadius: 8,
    resizeMode: "cover",
    borderWidth: 1,
    borderColor: colorScheme === "dark" ? "#1f1f1f" : "#e0e0e0",
  },
  gamePoster: {
    // Setting flex zooms in width and stretches height to fit remaining space
    flex: 1,
    width: Dimensions.get("window").width / 2 - 24, // is 50% of container width
    borderRadius: 8,
    resizeMode: "cover",
    borderWidth: 1,
    borderColor: colorScheme === "dark" ? "#1f1f1f" : "#e0e0e0",
  },
  date: {
    ...iOSUIKit.footnoteEmphasizedObject,
    color: iOSColors.gray,
  },
  credit: {
    // width: (Dimensions.get("window").width / 3) - 32, // is 50% of container width
    width: Dimensions.get("window").width / 3.5 - 32, // is 50% of container width
    // height: (4 / 3) * ((Dimensions.get("window").width / 3) - 32),
    height: (Dimensions.get("window").width / 3.5 - 32) * 1.5,
    borderRadius: 8,
    resizeMode: "stretch",
    marginTop: 16,
  },
  inset: { top: 0, bottom: 0, left: 0, right: 0 },
});
