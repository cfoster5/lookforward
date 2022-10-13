import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp, RouteProp } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";

import { Navigation } from "../interfaces/navigation";
import AccountScreen from "../screens/AccountScreen/AccountScreen";
import DeleteAccountScreen from "../screens/DeleteAccountScreen/DeleteAccountScreen";
import Settings from "../screens/Settings/Settings";

type SettingsStackNavProp = CompositeNavigationProp<
  StackNavigationProp<Navigation.SettingsStackParamList, "Settings">,
  BottomTabNavigationProp<Navigation.TabNavigationParamList>
>;

interface Props {
  navigation: SettingsStackNavProp;
  route: RouteProp<Navigation.TabNavigationParamList, "SettingsTab">;
}

const Stack = createNativeStackNavigator();
export function SettingsStack({ navigation, route }: Props) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Account" component={AccountScreen} />
      <Stack.Screen
        name="DeleteAccount"
        component={DeleteAccountScreen}
        options={{ title: "Delete Account" }}
      />
    </Stack.Navigator>
  );
}
