import React from "react";
import { Platform } from "react-native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp, RouteProp } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StackNavigationProp } from "@react-navigation/stack";

import { Navigation } from "../interfaces/navigation";
import Actor from "../screens/Actor";
import { Collection } from "../screens/Collection";
import Countdown from "../screens/Countdown";
import Movie from "../screens/Movie";
import MovieDiscover from "../screens/MovieDiscover";

type CountdownStackNavProp = CompositeNavigationProp<
  StackNavigationProp<Navigation.CountdownStackParamList, "Countdown">,
  BottomTabNavigationProp<Navigation.TabNavigationParamList>
>;

interface Props {
  navigation: CountdownStackNavProp;
  route: RouteProp<Navigation.TabNavigationParamList, "CountdownTab">;
}

const Stack = createNativeStackNavigator();
export function CountdownStack({ navigation, route }: Props) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Countdown"
        component={Countdown}
        options={{
          headerTransparent: Platform.OS === "ios" ? true : false,
          headerBlurEffect: "dark",
        }}
      />
      <Stack.Screen
        name="Movie"
        component={Movie}
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
          headerBlurEffect: "regular",
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
      <Stack.Screen
        name="Collection"
        component={Collection}
        options={{
          headerTransparent: Platform.OS === "ios" ? true : false,
          headerBlurEffect: "dark",
          title: "",
        }}
      />
    </Stack.Navigator>
  );
}
