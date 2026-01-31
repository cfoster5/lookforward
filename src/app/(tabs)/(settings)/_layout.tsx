import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Stack } from "expo-router";
import { Platform } from "react-native";

import { AppleStackPreset } from "../(search)/_layout";

export default function SettingsStack() {
  return (
    <Stack screenOptions={AppleStackPreset}>
      <Stack.Screen name="index" options={{ title: "Settings" }} />
      <Stack.Screen name="account" options={{ title: "Account" }} />
      <Stack.Screen
        name="delete-account"
        options={{ title: "Delete Account" }}
      />
      <Stack.Screen
        name="create-account"
        options={{ title: "Create Account" }}
      />
      <Stack.Screen name="login" options={{ title: "Welcome back!" }} />
      <Stack.Screen
        name="reset-password"
        options={{ title: "Reset Password" }}
      />
      <Stack.Screen
        name="app-icon"
        options={{
          headerShown: true,
          headerTransparent: Platform.OS === "ios",
          headerLargeTitle: false,
          title: "App Icon",
          presentation: "formSheet",
          sheetGrabberVisible: true,
          sheetAllowedDetents: "fitToContents",
          sheetInitialDetentIndex: Platform.OS === "ios" ? 0 : undefined,
          contentStyle: {
            backgroundColor:
              Platform.OS === "ios" && isLiquidGlassAvailable()
                ? "transparent"
                : "#F2F2F7",
          },
          headerStyle: {
            backgroundColor: Platform.OS === "ios" ? "transparent" : "#F2F2F7",
          },
          headerBlurEffect:
            Platform.OS === "ios" && isLiquidGlassAvailable()
              ? undefined
              : "light",
        }}
      />
    </Stack>
  );
}
