import {
  Appearance,
  Dimensions,
  PlatformColor,
  StyleSheet,
} from "react-native";
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
    borderColor:
      colorScheme === "dark" ? PlatformColor("systemGray6") : "#e0e0e0",
  },
  gamePoster: {
    // Setting flex zooms in width and stretches height to fit remaining space
    flex: 1,
    width: Dimensions.get("window").width / 2 - 24, // is 50% of container width
    borderRadius: 8,
    resizeMode: "cover",
    borderWidth: 1,
    borderColor:
      colorScheme === "dark" ? PlatformColor("systemGray6") : "#e0e0e0",
  },
  date: {
    ...iOSUIKit.footnoteEmphasizedObject,
    color: PlatformColor("systemGray"),
  },
});
