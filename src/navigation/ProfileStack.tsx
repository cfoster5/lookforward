import React from "react";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp, RouteProp } from "@react-navigation/native";
import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";

import { Navigation } from "../interfaces/navigation";
import Profile from "../screens/Profile";

type ProfileStackNavProp = CompositeNavigationProp<
  StackNavigationProp<Navigation.ProfileStackParamList, "Profile">,
  BottomTabNavigationProp<Navigation.TabNavigationParamList>
>;

interface Props {
  navigation: ProfileStackNavProp;
  route: RouteProp<Navigation.TabNavigationParamList, "Countdown">;
}

const Stack = createStackNavigator<Navigation.ProfileStackParamList>();
export function ProfileStack({ navigation, route }: Props) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
}
