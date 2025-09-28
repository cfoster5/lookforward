import * as Colors from "@bacons/apple-colors";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Stack } from "expo-router";

export { ErrorBoundary } from "expo-router";

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
            color: Colors.label as any,
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

export default function Layout() {
  return (
    <Stack screenOptions={AppleStackPreset}>
      <Stack.Screen
        name="search"
        options={{
          title: "Search",
          headerSearchBarOptions: {},

          // headerRight: () => (
          //   <div className="web:px-4">
          //     <LaunchButton />
          //   </div>
          // ),
        }}
      />
    </Stack>
  );
}
