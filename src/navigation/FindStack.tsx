import React from 'react';
import { createStackNavigator, StackNavigationProp } from "@react-navigation/stack";
import Actor from '../screens/Actor';
import Details from "../screens/Details";
import Search from "../screens/Search";
import { Navigation } from "../../types";
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

type FindStackNavProp = CompositeNavigationProp<
  StackNavigationProp<Navigation.FindStackParamList, "Find">,
  BottomTabNavigationProp<Navigation.TabNavigationParamList>
>;

interface Props {
  navigation: FindStackNavProp;
  route: RouteProp<Navigation.TabNavigationParamList, "Find">;
  countdownMovies: any[];
  countdownGames: any[];
  showSubs: any[];
}

const Stack = createStackNavigator<Navigation.FindStackParamList>();
export function FindStack({ navigation, route, countdownMovies, countdownGames, showSubs }: Props) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Find" initialParams={{ uid: route.params.uid, igdbCreds: route.params.igdbCreds }}>
        {props => <Search
          {...props}
          countdownMovies={countdownMovies}
          showSubs={showSubs}
        />}
      </Stack.Screen>
      <Stack.Screen name="Details" initialParams={{ uid: route.params.uid }}>
        {props => <Details
          {...props}
          countdownMovies={countdownMovies}
          countdownGames={countdownGames}
          showSubs={showSubs}
        />}
      </Stack.Screen>
      {/* <Stack.Screen name="Actor" component={Actor} /> */}
    </Stack.Navigator>
  )
}
