import React from "react";
import { Platform } from "react-native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { RouteProp } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Navigation } from "../interfaces/navigation";
import Actor from "../screens/Actor";
import Details from "../screens/Details";
import GameDiscover from "../screens/GameDiscover";
import MovieDiscover from "../screens/MovieDiscover";
import Search from "../screens/Search";

// type FindStackNavProp = CompositeNavigationProp<
//   StackNavigationProp<Navigation.FindStackParamList, "Find">,
//   BottomTabNavigationProp<Navigation.TabNavigationParamList>
// >;
type FindStackNavProp = BottomTabNavigationProp<
  Navigation.TabNavigationParamList,
  "FindTab"
>;

interface Props {
  navigation: FindStackNavProp;
  route: RouteProp<Navigation.TabNavigationParamList, "FindTab">;
}

const Stack = createNativeStackNavigator();
export function FindStack({ navigation, route }: Props) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Find"
        component={Search}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Details"
        component={Details}
        options={{
          headerTransparent: Platform.OS === "ios" ? true : false,
          headerBlurEffect: "dark",
          title: "",
        }}
      />
      <Stack.Screen
        name="MovieDiscover"
        component={MovieDiscover}
        options={{
          headerTransparent: Platform.OS === "ios" ? true : false,
          headerBlurEffect: "dark",
          title: "",
        }}
      />
      <Stack.Screen
        name="GameDiscover"
        component={GameDiscover}
        options={{
          headerTransparent: Platform.OS === "ios" ? true : false,
          headerBlurEffect: "dark",
          title: "",
        }}
      />
      <Stack.Screen
        name="Actor"
        component={Actor}
        options={{
          headerTransparent: Platform.OS === "ios" ? true : false,
          headerBlurEffect: "dark",
          title: "",
        }}
      />
    </Stack.Navigator>
  );
}
