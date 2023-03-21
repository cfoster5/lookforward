import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GamePlatformPicker } from "components/GamePlatformPicker";
import React from "react";
import { Platform } from "react-native";

import Actor from "../screens/Actor/Actor";
import { Collection } from "../screens/Collection/Collection";
import Game from "../screens/Game/Game";
import GameDiscover from "../screens/GameDiscover/GameDiscover";
import Movie from "../screens/Movie/Movie";
import MovieDiscover from "../screens/MovieDiscover/MovieDiscover";
import Search from "../screens/Search/Search";

import { FindStackParamList } from "@/types";

const Stack = createNativeStackNavigator();
export function FindStack({ navigation, route }: FindStackParamList) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Find"
        component={Search}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Movie"
        component={Movie}
        options={{
          headerTransparent: Platform.OS === "ios",
          headerBlurEffect: "dark",
          title: "",
        }}
      />
      <Stack.Screen
        name="Game"
        component={Game}
        options={{
          headerTransparent: Platform.OS === "ios",
          headerBlurEffect: "dark",
          title: "",
        }}
      />
      <Stack.Screen
        name="MovieDiscover"
        component={MovieDiscover}
        options={{
          headerTransparent: Platform.OS === "ios",
          headerBlurEffect: "dark",
          title: "",
        }}
      />
      <Stack.Screen
        name="GameDiscover"
        component={GameDiscover}
        options={{
          headerTransparent: Platform.OS === "ios",
          headerBlurEffect: "dark",
          title: "",
        }}
      />
      <Stack.Screen
        name="Actor"
        component={Actor}
        options={{
          headerTransparent: Platform.OS === "ios",
          headerBlurEffect: "dark",
          title: "",
        }}
      />
      <Stack.Screen
        name="Collection"
        component={Collection}
        options={{
          headerTransparent: Platform.OS === "ios",
          headerBlurEffect: "dark",
          title: "",
        }}
      />
    </Stack.Navigator>
  );
}
