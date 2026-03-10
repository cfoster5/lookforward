import { StyleSheet } from "react-native";

import { colors } from "@/theme/colors";

export function createCountdownItemStyles(
  isFirstInSection: boolean,
  isLastInSection: boolean,
  isSelected: boolean,
  aspectRatio: number,
) {
  return StyleSheet.create({
    rowFront: {
      borderCurve: "continuous",
      borderTopLeftRadius: isFirstInSection ? 26 : 0,
      borderTopRightRadius: isFirstInSection ? 26 : 0,
      borderBottomLeftRadius: isLastInSection ? 26 : 0,
      borderBottomRightRadius: isLastInSection ? 26 : 0,
      overflow: "hidden",
      backgroundColor: isSelected ? colors.systemGray4 : colors.systemGray6,
    },
    image: {
      width: 60,
      aspectRatio,
      borderRadius: 13,
      marginLeft: 16,
      marginVertical: 16,
      borderCurve: "continuous",
      marginRight: 8,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.separator,
    },
    middle: {
      flex: 1,
      justifyContent: "center",
      paddingVertical: 8,
      paddingRight: 8,
    },
    countdown: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 8,
      paddingRight: 16,
    },
    separator: {
      position: "absolute",
      right: 0,
      bottom: 0,
      height: isLastInSection ? 0 : StyleSheet.hairlineWidth,
      backgroundColor: colors.separator,
      zIndex: 1,
    },
    radioButtonContainer: {
      justifyContent: "center",
      alignItems: "flex-end",
      overflow: "hidden",
    },
  });
}

export const staticCountdownItemStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flex: 1,
    position: "relative",
  },
  posterShadow: {
    justifyContent: "center",
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    shadowColor: "rgba(0, 0, 0, 0.15)",
    shadowOpacity: 1,
  },
});
