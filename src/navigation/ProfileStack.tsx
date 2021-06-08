import React from 'react';
import { createStackNavigator, StackNavigationProp } from "@react-navigation/stack";
import { Navigation } from "../../types";
import Profile from '../screens/Profile';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

type ProfileStackNavProp = CompositeNavigationProp<
  StackNavigationProp<Navigation.ProfileStackParamList, "Profile">,
  BottomTabNavigationProp<Navigation.TabNavigationParamList>
>;

interface Props {
  navigation: ProfileStackNavProp,
  route: RouteProp<Navigation.TabNavigationParamList, "Countdown">
}

const Stack = createStackNavigator<Navigation.ProfileStackParamList>();
export function ProfileStack({ navigation, route }: Props) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  )
}
