import { Stack } from "expo-router";

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
    </Stack>
  );
}
