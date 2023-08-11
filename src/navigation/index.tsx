import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { ColorSchemeName } from "react-native";
import { OverflowMenuProvider } from "react-navigation-header-buttons";

import { AuthStack } from "./AuthStack";
import { TabStack } from "./TabStack";
import TabStackContext from "../contexts/TabStackContext";

import { useStore } from "@/stores/store";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

function RootNavigator() {
  const { user } = useStore();
  if (!user) return <AuthStack />;
  return (
    <OverflowMenuProvider>
      <TabStackContext.Provider value={{ theme: "dark" }}>
        <TabStack />
      </TabStackContext.Provider>
    </OverflowMenuProvider>
  );
}
