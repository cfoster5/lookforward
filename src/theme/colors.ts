import { Color } from "expo-router";
import { ColorValue, Platform } from "react-native";

type AppColors = {
  label: ColorValue;
  secondaryLabel: ColorValue;
  tertiaryLabel: ColorValue;
  placeholderText: ColorValue;
  separator: ColorValue;
  systemBlue: ColorValue;
  systemRed: ColorValue;
  systemOrange: ColorValue;
  systemGray: ColorValue;
  systemGray3: ColorValue;
  systemGray4: ColorValue;
  systemGray5: ColorValue;
  systemGray6: ColorValue;
  secondarySystemBackground: ColorValue;
  secondarySystemGroupedBackground: ColorValue;
  tertiarySystemBackground: ColorValue;
  tertiarySystemGroupedBackground: ColorValue;
  tertiarySystemFill: ColorValue;
};

const defaults = Platform.select({
  ios: {
    label: Color.ios.label,
    secondaryLabel: Color.ios.secondaryLabel,
    tertiaryLabel: Color.ios.tertiaryLabel,
    placeholderText: Color.ios.placeholderText,
    separator: Color.ios.separator,
    systemBlue: Color.ios.systemBlue,
    systemRed: Color.ios.systemRed,
    systemOrange: Color.ios.systemOrange,
    systemGray: Color.ios.systemGray,
    systemGray3: Color.ios.systemGray3,
    systemGray4: Color.ios.systemGray4,
    systemGray5: Color.ios.systemGray5,
    systemGray6: Color.ios.systemGray6,
    secondarySystemBackground: Color.ios.secondarySystemBackground,
    secondarySystemGroupedBackground:
      Color.ios.secondarySystemGroupedBackground,
    tertiarySystemBackground: Color.ios.tertiarySystemBackground,
    tertiarySystemGroupedBackground: Color.ios.tertiarySystemGroupedBackground,
    tertiarySystemFill: Color.ios.tertiarySystemFill,
  },
  default: {
    label: Color.android.dynamic.onSurface,
    secondaryLabel: Color.android.dynamic.onSurfaceVariant,
    tertiaryLabel: Color.android.dynamic.outline,
    placeholderText: Color.android.dynamic.outline,
    separator: Color.android.dynamic.outlineVariant,
    systemBlue: Color.android.dynamic.primary,
    systemRed: Color.android.dynamic.error,
    systemOrange: Color.android.dynamic.tertiary,
    systemGray: Color.android.dynamic.outline,
    systemGray3: Color.android.dynamic.surfaceContainerHigh,
    systemGray4: Color.android.dynamic.surfaceContainerHigh,
    systemGray5: Color.android.dynamic.surfaceContainerLow,
    systemGray6: Color.android.dynamic.surfaceContainerLowest,
    secondarySystemBackground: Color.android.dynamic.surfaceContainer,
    secondarySystemGroupedBackground:
      Color.android.dynamic.surfaceContainerHigh,
    tertiarySystemBackground: Color.android.dynamic.surfaceContainerHighest,
    tertiarySystemGroupedBackground:
      Color.android.dynamic.surfaceContainerHighest,
    tertiarySystemFill: Color.android.dynamic.surfaceContainerHighest,
  },
});

export const colors: AppColors = defaults;
