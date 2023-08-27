import { Platform, PlatformColor } from "react-native";

const tintColorLight = "#2f95dc";
const tintColorDark = "#fff";

export const Colors = {
  label: Platform.OS === "ios" ? PlatformColor("label") : "#FFFFFF",
  secondaryLabel:
    Platform.OS === "ios" ? PlatformColor("secondaryLabel") : "#EBEBF560",
  tertiaryLabel:
    Platform.OS === "ios" ? PlatformColor("tertiaryLabel") : "#EBEBF530",
  tertiaryFill:
    Platform.OS === "ios"
      ? PlatformColor("tertiarySystemFillColor")
      : "#76768024",
  secondaryBackground:
    Platform.OS === "ios"
      ? PlatformColor("secondarySystemBackground")
      : "#1C1C1E",
  tertiaryBackground:
    Platform.OS === "ios"
      ? PlatformColor("tertiarySystemBackground")
      : "#2C2C2E",
  separator: Platform.OS === "ios" ? PlatformColor("separator") : "#54545865",
  blue: Platform.OS === "ios" ? PlatformColor("systemBlue") : "#0A84FF",
  brown: Platform.OS === "ios" ? PlatformColor("systemBrown") : "#AC8E68",
  red: Platform.OS === "ios" ? PlatformColor("systemRed") : "#FF453A",
  yellow: Platform.OS === "ios" ? PlatformColor("systemYellow") : "#FFD60A",
  gray: Platform.OS === "ios" ? PlatformColor("systemGray") : "#8E8E93",
  gray2: Platform.OS === "ios" ? PlatformColor("systemGray2") : "#636366",
  gray3: Platform.OS === "ios" ? PlatformColor("systemGray3") : "#48484A",
  gray4: Platform.OS === "ios" ? PlatformColor("systemGray4") : "#3A3A3C",
  gray5: Platform.OS === "ios" ? PlatformColor("systemGray5") : "#2C2C2E",
  gray6: Platform.OS === "ios" ? PlatformColor("systemGray6") : "#1C1C1E",
  // light: {
  //   text: "#000",
  //   background: "#fff",
  //   tint: tintColorLight,
  //   tabIconDefault: "#ccc",
  //   tabIconSelected: tintColorLight,
  // },
  // dark: {
  //   text: "#fff",
  //   background: "#000",
  //   tint: tintColorDark,
  //   tabIconDefault: "#ccc",
  //   tabIconSelected: tintColorDark,
  // },
};
