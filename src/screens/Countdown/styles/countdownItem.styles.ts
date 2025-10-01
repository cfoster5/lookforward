import * as Colors from "@bacons/apple-colors";
import { StyleSheet } from "react-native";

export function createCountdownItemStyles(
  isFirstInSection: boolean,
  isLastInSection: boolean,
  isSelected: boolean,
  aspectRatio: number,
) {
  return StyleSheet.create({
    rowFront: {
      borderTopLeftRadius: isFirstInSection ? 10 : 0,
      borderTopRightRadius: isFirstInSection ? 10 : 0,
      borderBottomLeftRadius: isLastInSection ? 10 : 0,
      borderBottomRightRadius: isLastInSection ? 10 : 0,
      overflow: "hidden",
      backgroundColor: isSelected ? Colors.systemGray4 : Colors.systemGray6,
    },
    slide: {
      flex: 1,
      flexDirection: "row",
      flexWrap: "wrap",
    },
    image: {
      width: 60,
      aspectRatio,
      borderRadius: 6,
      marginLeft: 16,
      marginTop: 8,
      marginBottom: 8,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Colors.separator,
    },
    middle: {
      borderColor: Colors.separator,
      borderBottomWidth: isLastInSection ? 0 : StyleSheet.hairlineWidth,
      flex: 1,
      justifyContent: "center",
      marginLeft: 16,
      paddingTop: 8,
      paddingBottom: 8,
    },
    countdown: {
      borderColor: Colors.separator,
      borderBottomWidth: isLastInSection ? 0 : StyleSheet.hairlineWidth,
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 8,
      paddingBottom: 8,
    },
    radioButtonContainer: {
      justifyContent: "center",
    },
  });
}

export const staticCountdownItemStyles = StyleSheet.create({
  posterShadow: {
    justifyContent: "center",
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    shadowColor: "rgba(0, 0, 0, 0.15)",
    shadowOpacity: 1,
  },
});
