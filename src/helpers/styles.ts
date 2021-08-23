import { Appearance, Dimensions, StyleSheet } from "react-native";
import { iOSColors, iOSUIKit } from "react-native-typography";

// const colorScheme = Appearance.getColorScheme();
const colorScheme = "dark"

export const reusableStyles = StyleSheet.create({
  itemLeft: {
    // width: (Dimensions.get("window").width / 2) - 32, // is 50% of container width
    // height: (4 / 3) * ((Dimensions.get("window").width / 2) - 32),
    width: (Dimensions.get("window").width / 2) - 24, // is 50% of container width
    height: (713 / 500) * ((Dimensions.get("window").width / 2) - 24),
    borderRadius: 8,
    resizeMode: "stretch",
    // marginTop: 16,
    marginBottom: 16,
    // marginLeft: 24,
    // marginRight: 8
    marginLeft: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colorScheme === "dark" ? "#1f1f1f" : "#e0e0e0"
  },
  itemRight: {
    width: (Dimensions.get("window").width / 2) - 24, // is 50% of container width
    height: (713 / 500) * ((Dimensions.get("window").width / 2) - 24),
    borderRadius: 8,
    resizeMode: "cover",
    // marginBottom: 16,
    // marginLeft: 8,
    // marginRight: 16,
    borderWidth: 1,
    borderColor: colorScheme === "dark" ? "#1f1f1f" : "#e0e0e0"
  },
  horizontalItem: {
    width: (Dimensions.get("window").width / 2) - 32, // is 50% of container width
    // height: (4 / 3) * ((Dimensions.get("window").width / 2) - 32),
    height: (4 / 3) * ((Dimensions.get("window").width / 2) - 32),
    borderRadius: 8,
    resizeMode: "stretch",
    marginTop: 16,
    marginLeft: 16,
  },
  date: {
    ...iOSUIKit.footnoteEmphasizedObject,
    color: iOSColors.gray
  },
  credit: {
    // width: (Dimensions.get("window").width / 3) - 32, // is 50% of container width
    width: (Dimensions.get("window").width / 3.5) - 32, // is 50% of container width
    // height: (4 / 3) * ((Dimensions.get("window").width / 3) - 32),
    height: (625 / 417) * ((Dimensions.get("window").width / 3.5) - 32),
    borderRadius: 8,
    resizeMode: "stretch",
    marginTop: 16,
  },
  actor: {
    width: (Dimensions.get("window").width / 2) - 24, // is 50% of container width
    height: (4 / 3) * ((Dimensions.get("window").width / 2) - 24),
    borderRadius: 8,
    resizeMode: "stretch"
  },
  searchCredit: {
    // I don't know why 18 works here to center the right-most image but it works on every iOS device tested
    width: (Dimensions.get("window").width / 3.5) - 18,
    height: ((Dimensions.get("window").width / 3.5) - 18) * 1.5,
    borderRadius: 8,
    marginBottom: 8
  },
})
