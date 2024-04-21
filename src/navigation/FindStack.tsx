import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Platform } from "react-native";

import Actor from "../screens/Actor/Actor";
import { Collection } from "../screens/Collection/Collection";
import Game from "../screens/Game/Game";
import GameDiscover from "../screens/GameDiscover/GameDiscover";
import Movie from "../screens/Movie/Movie";
import MovieDiscover from "../screens/MovieDiscover/MovieDiscover";
import Search from "../screens/Search/Search";

import { FindStackParamList } from "@/types";

const Stack = createNativeStackNavigator<FindStackParamList>();
export function FindStack() {
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
        options={({ route }) => ({
          headerTransparent: Platform.OS === "ios",
          headerBlurEffect: "dark",
          title: route.params.name,
        })}
      />
      <Stack.Screen
        name="Game"
        component={Game}
        options={({ route }) => ({
          headerTransparent: Platform.OS === "ios",
          headerBlurEffect: "dark",
          title: route.params.game.name,
        })}
      />
      <Stack.Screen
        name="MovieDiscover"
        component={MovieDiscover}
        options={({ route }) => ({
          headerTransparent: Platform.OS === "ios",
          headerBlurEffect: "dark",
          title: route.params.screenTitle,
        })}
      />
      <Stack.Screen
        name="GameDiscover"
        component={GameDiscover}
        options={({ route }) => ({
          headerTransparent: Platform.OS === "ios",
          headerBlurEffect: "dark",
          title: route.params.screenTitle,
        })}
      />
      <Stack.Screen
        name="Actor"
        component={Actor}
        options={({ route }) => ({
          headerTransparent: Platform.OS === "ios",
          headerBlurEffect: "dark",
          title: route.params.name,
        })}
      />
      <Stack.Screen
        name="Collection"
        component={Collection}
        options={({ route }) => ({
          headerTransparent: Platform.OS === "ios",
          headerBlurEffect: "dark",
          title: route.params.name,
        })}
      />
    </Stack.Navigator>
  );
}
