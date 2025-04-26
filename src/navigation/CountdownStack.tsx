import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Platform } from "react-native";

import { MultiItemHeader, ShareHeader } from "@/components/Headers";
import { DeleteHeader } from "@/screens/Countdown/components/DeleteHeader.ios";
import { MyHeaderRight } from "@/screens/Countdown/components/MyHeaderRight.ios";
import Game from "@/screens/Game/Game";
import GameDiscover from "@/screens/GameDiscover/GameDiscover";
import MovieDiscover from "@/screens/MovieDiscover/MovieDiscover";
import { CountdownStackParamList } from "@/types";

import Actor from "../screens/Actor/Actor";
import { Collection } from "../screens/Collection/Collection";
import Countdown from "../screens/Countdown/Countdown";
import Movie from "../screens/Movie/Movie";

const Stack = createNativeStackNavigator<CountdownStackParamList>();
export function CountdownStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Countdown"
        component={Countdown}
        options={{
          headerTransparent: Platform.OS === "ios",
          headerBlurEffect: "dark",
          headerRight: MyHeaderRight,
          headerLeft: DeleteHeader,
        }}
      />
      <Stack.Screen
        name="Movie"
        component={Movie}
        options={({ route }) => ({
          headerTransparent: Platform.OS === "ios",
          headerBlurEffect: "dark",
          title: route.params.name,
          // Add a placeholder button without the `onPress` to avoid flicker
          headerRight: MultiItemHeader,
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
          // Add a placeholder button without the `onPress` to avoid flicker
          headerRight: ShareHeader,
        })}
      />
      <Stack.Screen
        name="Collection"
        component={Collection}
        options={({ route }) => ({
          headerTransparent: Platform.OS === "ios",
          headerBlurEffect: "dark",
          title: route.params.name,
          // Add a placeholder button without the `onPress` to avoid flicker
          headerRight: ShareHeader,
        })}
      />
    </Stack.Navigator>
  );
}
