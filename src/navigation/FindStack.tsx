import React from "react";
import { Platform } from "react-native";
import { BlurView } from "@react-native-community/blur";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp, RouteProp } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStackNavigator } from "@react-navigation/stack";

import { BlurHeader } from "../components/BlurHeader";
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

const Stack = createStackNavigator();
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
