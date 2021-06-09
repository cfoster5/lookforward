import React from 'react';
import { createStackNavigator, StackNavigationProp } from "@react-navigation/stack";
import Countdown from '../screens/Countdown';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { Navigation } from '../../types';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import Details from '../screens/Details';

type CountdownStackNavProp = CompositeNavigationProp<
  StackNavigationProp<Navigation.CountdownStackParamList, "Countdown">,
  BottomTabNavigationProp<Navigation.TabNavigationParamList>
>;

interface Props {
  navigation: CountdownStackNavProp,
  route: RouteProp<Navigation.TabNavigationParamList, "Countdown">,
}

const Stack = createStackNavigator<any>();
export function CountdownStack({ navigation, route }: Props) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Countdown" component={Countdown} />
      <Stack.Screen name="Details" component={Details} />
    </Stack.Navigator>
  )
}
