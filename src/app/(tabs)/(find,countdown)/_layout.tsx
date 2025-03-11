import { Stack } from "expo-router";
import { Platform } from "react-native";

import { MultiItemHeader } from "@/components/Headers";

export const unstable_settings = {
  initialRouteName: "(find)",
  countdown: {
    initialRouteName: "countdown/index",
  },
};

function SharedLayout({ children }) {
  return (
    <Stack>
      {children}
      <Stack.Screen
        name="movie/[id]"
        options={({ route }) => ({
          title: route.params.name,
          headerTransparent: Platform.OS === "ios",
          headerBlurEffect: "dark",
          // Add a placeholder button without the `onPress` to avoid flicker
          headerRight: MultiItemHeader,
        })}
      />
      <Stack.Screen
        name="actor/[id]"
        options={({ route }) => ({
          title: route.params.name,
          headerTransparent: Platform.OS === "ios",
          headerBlurEffect: "dark",
          // Add a placeholder button without the `onPress` to avoid flicker
          headerRight: MultiItemHeader,
        })}
      />
      <Stack.Screen
        name="movie-discover/index"
        options={({ route }) => ({
          title: route.params.screenTitle,
          headerTransparent: Platform.OS === "ios",
          headerBlurEffect: "dark",
          // Add a placeholder button without the `onPress` to avoid flicker
          headerRight: MultiItemHeader,
        })}
      />
      <Stack.Screen
        name="movie-collection/[id]"
        options={({ route }) => ({
          title: route.params.name,
          headerTransparent: Platform.OS === "ios",
          headerBlurEffect: "dark",
          // Add a placeholder button without the `onPress` to avoid flicker
          headerRight: MultiItemHeader,
        })}
      />
    </Stack>
  );
}

export default function DynamicLayout({ segment }) {
  if (segment === "(find)") {
    return (
      <SharedLayout>
        <Stack.Screen
          name="index"
          options={{ title: "Find", headerShown: false }}
        />
      </SharedLayout>
    );
  }

  return (
    <SharedLayout>
      <Stack.Screen name="index" options={{ title: "Countdown" }} />
    </SharedLayout>
  );
}
