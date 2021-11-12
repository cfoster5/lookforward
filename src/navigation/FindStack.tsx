import React from "react";
import { Platform } from "react-native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp, RouteProp } from "@react-navigation/native";
import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";

import { BlurHeader } from "../components/BlurHeader";
import { Navigation } from "../interfaces/navigation";
import Actor from "../screens/Actor";
import Details from "../screens/Details";
import GameDiscover from "../screens/GameDiscover";
import MovieDiscover from "../screens/MovieDiscover";
import Search from "../screens/Search";

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
      <Stack.Screen
        name="Find"
        component={Search}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Details"
        component={Details}
        options={{
          header: (props) => <BlurHeader {...props} />,
          headerTransparent: Platform.OS === "ios" ? true : false,
          title: "",
        }}
      />
      <Stack.Screen
        name="MovieDiscover"
        component={MovieDiscover}
        options={{
          header: (props) => <BlurHeader {...props} />,
          headerTransparent: Platform.OS === "ios" ? true : false,
          title: "",
        }}
      />
      <Stack.Screen
        name="GameDiscover"
        component={GameDiscover}
        options={{
          header: (props) => <BlurHeader {...props} />,
          headerTransparent: Platform.OS === "ios" ? true : false,
          title: "",
        }}
      />
      <Stack.Screen
        name="Actor"
        component={Actor}
        options={{
          header: (props) => <BlurHeader {...props} />,
          headerTransparent: Platform.OS === "ios" ? true : false,
          title: "",
        }}
      />
    </Stack.Navigator>
  );
}
