import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ColorSchemeName } from "react-native";
import { OverflowMenuProvider } from "react-navigation-header-buttons";

import { AuthStack } from "./AuthStack";
import { TabStack } from "./TabStack";
import TabStackContext from "../contexts/TabStackContext";

import { ExplorePro } from "@/components/ExplorePro";
import { OnboardingModal } from "@/components/OnboardingModal";
import { useStore } from "@/stores/store";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  const { onboardingModalRef, proModalRef } = useStore();
  return (
    <NavigationContainer
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <OnboardingModal modalRef={onboardingModalRef} />
      <ExplorePro modalRef={proModalRef} />
      <RootNavigator />
    </NavigationContainer>
  );
}

function RootNavigator() {
  const { user } = useStore();

  useEffect(() => {
    const hideSplashScreen = async () => await SplashScreen.hideAsync();
    hideSplashScreen();
  }, [user]);

  if (!user) return <AuthStack />;
  return (
    <OverflowMenuProvider>
      <TabStackContext.Provider value={{ theme: "dark" }}>
        <TabStack />
      </TabStackContext.Provider>
    </OverflowMenuProvider>
  );
}
