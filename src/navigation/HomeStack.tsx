import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import Actor from "../../Actor";
import Details from "../../Details";
import Search from "../../Search";
import { Navigation } from "../../types";

const HomeStack = createStackNavigator<Navigation.HomeStackParamList>();
export function HomeStackScreen({route}: any) {
  return <HomeStack.Navigator>
    <HomeStack.Screen name="Find" component={Search} initialParams={{ uid: route.params.uid }} />
    <HomeStack.Screen name="Details" component={Details} initialParams={{ uid: route.params.uid }} />
    <HomeStack.Screen name="Actor" component={Actor} />
  </HomeStack.Navigator>
}
