import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { isLiquidGlassAvailable } from "expo-glass-effect";

import { colors } from "@/theme/colors";

export const AppleStackPreset: NativeStackNavigationOptions =
  process.env.EXPO_OS !== "ios"
    ? {}
    : isLiquidGlassAvailable()
      ? {
          // iOS 26 + liquid glass
          headerTransparent: true,
          headerShadowVisible: false,
          headerLargeTitleShadowVisible: false,
          headerLargeStyle: {
            backgroundColor: "transparent",
          },
          headerTitleStyle: {
            color: colors.label as string,
          },
          headerLargeTitle: true,
          headerBlurEffect: "none",
          headerBackButtonDisplayMode: "minimal",
        }
      : {
          headerTransparent: true,
          headerShadowVisible: true,
          headerLargeTitleShadowVisible: false,
          headerLargeStyle: {
            backgroundColor: "transparent",
          },
          headerLargeTitle: true,
          headerBlurEffect: "systemChromeMaterial",
          headerBackButtonDisplayMode: "default",
        };
