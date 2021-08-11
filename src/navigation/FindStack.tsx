import React from 'react';
import { createStackNavigator, StackNavigationProp } from "@react-navigation/stack";
import Actor from '../screens/Actor';
import Details from "../screens/Details";
import Search from "../screens/Search";
import { Navigation } from "../../types";
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { BlurHeader } from '../components/BlurHeader';
import MovieGenre from '../screens/MovieGenre';
import { Platform } from 'react-native';
import ProductionCompany from '../screens/ProductionCompany';
import MovieKeyword from '../screens/MovieKeyword';
import MovieDiscover from '../screens/MovieDiscover';
import GameDiscover from '../screens/GameDiscover';

type FindStackNavProp = CompositeNavigationProp<
  StackNavigationProp<Navigation.FindStackParamList, "Find">,
  BottomTabNavigationProp<Navigation.TabNavigationParamList>
>;

interface Props {
  navigation: FindStackNavProp;
  route: RouteProp<Navigation.TabNavigationParamList, "Find">;
}

const Stack = createStackNavigator<Navigation.FindStackParamList>();
export function FindStack({ navigation, route }: Props) {
  return (
    <Stack.Navigator headerMode="screen">
      <Stack.Screen name="Find" component={Search} />
      <Stack.Screen
        name="Details"
        component={Details}
        options={{
          header: props => <BlurHeader {...props} />,
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
        name="GameDiscover"
        component={GameDiscover}
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
