import React from 'react';
import { createStackNavigator, StackNavigationProp } from "@react-navigation/stack";
import Countdown from '../screens/Countdown';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import Details from '../screens/Details';
import { BlurHeader } from '../components/BlurHeader';
import { Platform } from 'react-native';
import MovieDiscover from '../screens/MovieDiscover';
import Actor from '../screens/Actor';
import { Navigation } from '../interfaces/navigation';

type CountdownStackNavProp = CompositeNavigationProp<
  StackNavigationProp<Navigation.CountdownStackParamList, "Countdown">,
  BottomTabNavigationProp<Navigation.TabNavigationParamList>
>;

interface Props {
  navigation: CountdownStackNavProp,
  route: RouteProp<Navigation.TabNavigationParamList, "Countdown">,
}

const Stack = createStackNavigator();
export function CountdownStack({ navigation, route }: Props) {
  return (
    <Stack.Navigator headerMode="screen">
      <Stack.Screen
        name="Countdown"
        component={Countdown}
        options={{
          header: (props) => <BlurHeader {...props} />,
          headerTransparent: Platform.OS === "ios" ? true : false
        }}
      />
      <Stack.Screen
        name="Details"
        component={Details}
        options={{
          header: (props) => <BlurHeader {...props} />,
          headerTransparent: Platform.OS === "ios" ? true : false,
          title: ""
        }}
      />
      <Stack.Screen
        name="MovieDiscover"
        component={MovieDiscover}
        options={{
          header: props => <BlurHeader {...props} />,
          headerTransparent: Platform.OS === "ios" ? true : false,
          title: ""
        }}
      />
      <Stack.Screen
        name="Actor"
        component={Actor}
        options={{
          header: props => <BlurHeader {...props} />,
          headerTransparent: Platform.OS === "ios" ? true : false,
          title: ""
        }}
      />
    </Stack.Navigator>
  )
}
