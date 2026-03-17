import { StyleSheet } from "react-native";

import { colors } from "@/theme/colors";

const sectionRadius = 26;

export const countdownItemStyles = StyleSheet.create({
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
  rowFront: {
    borderCurve: "continuous",
    overflow: "hidden",
    backgroundColor: colors.systemGray6,
  },
  rowFrontSelected: {
    backgroundColor: colors.systemGray4,
  },
  rowFrontFirst: {
    borderTopLeftRadius: sectionRadius,
    borderTopRightRadius: sectionRadius,
  },
  rowFrontLast: {
    borderBottomLeftRadius: sectionRadius,
    borderBottomRightRadius: sectionRadius,
  },
  image: {
    width: 60,
    borderRadius: 13,
    marginLeft: 16,
    marginVertical: 16,
    borderCurve: "continuous",
    marginRight: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.separator,
  },
  imageFallback: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.tertiarySystemFill as string,
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
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.separator,
    zIndex: 1,
  },
  separatorHidden: {
    height: 0,
  },
  radioButtonContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
    overflow: "hidden",
  },
});
