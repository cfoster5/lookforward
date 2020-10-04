import { Dimensions, StyleSheet } from "react-native";
import { iOSColors, iOSUIKit } from "react-native-typography";

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
    marginRight: 8
  },
  itemRight: {
    // width: (Dimensions.get("window").width / 2) - 32, // is 50% of container width
    // height: (4 / 3) * ((Dimensions.get("window").width / 2) - 32),
    width: (Dimensions.get("window").width / 2) - 24, // is 50% of container width
    height: (713 / 500) * ((Dimensions.get("window").width / 2) - 24),
    borderRadius: 8,
    resizeMode: "stretch",
    // marginTop: 16,
    marginBottom: 16,
    // marginLeft: 8,
    // marginRight: 24
    marginLeft: 8,
    marginRight: 16
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
})
