import { useReactNavigationDevTools } from "@dev-plugins/react-navigation";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  useNavigationContainerRef,
} from "@react-navigation/native";
import * as Linking from "expo-linking";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { HeaderButtonsProvider } from "react-navigation-header-buttons";

import { ExplorePro } from "@/components/ExplorePro";
import { OnboardingModal } from "@/components/OnboardingModal";
import { useStore } from "@/stores/store";

import { AuthStack } from "./AuthStack";
import { TabStack } from "./TabStack";

export default function Navigation() {
  const navigationRef = useNavigationContainerRef();
  useReactNavigationDevTools(navigationRef);
  const { theme } = useStore();
  const linking = {
    prefixes: [Linking.createURL("/"), "https://getlookforward.app"],
    config: {
      screens: {
        FindTab: {
          initialRouteName: "Find",
          screens: {
            Find: "find",
            Movie: "movie/:movieId",
            Actor: "person/:personId",
            Collection: "collection/:collectionId",
          },
        },
      },
    },
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={theme === "dark" ? DarkTheme : DefaultTheme}
      linking={linking}
      // fallback={<Text>Loading...</Text>}
    >
      <OnboardingModal />
      <ExplorePro />
      <RootNavigator />
    </NavigationContainer>
  );
}

function RootNavigator() {
  const { user } = useStore();

  if (!user) return <AuthStack />;
  return (
    <HeaderButtonsProvider stackType="native">
      <TabStack />
    </HeaderButtonsProvider>
  );
}
