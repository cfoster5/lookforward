import React from "react";
import { Platform } from "react-native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp, RouteProp } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";

import { BlurHeader } from "../components/BlurHeader";
import { Navigation } from "../interfaces/navigation";
import Actor from "../screens/Actor";
import Countdown from "../screens/Countdown";
import Details from "../screens/Details";
import MovieDiscover from "../screens/MovieDiscover";

type CountdownStackNavProp = CompositeNavigationProp<
  StackNavigationProp<Navigation.CountdownStackParamList, "Countdown">,
  BottomTabNavigationProp<Navigation.TabNavigationParamList>
>;

interface Props {
  navigation: CountdownStackNavProp;
  route: RouteProp<Navigation.TabNavigationParamList, "CountdownTab">;
}

const Stack = createStackNavigator();
export function CountdownStack({ navigation, route }: Props) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Countdown"
        component={Countdown}
        options={{
          header: (props) => <BlurHeader {...props} />,
          headerTransparent: Platform.OS === "ios" ? true : false,
        }}
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
