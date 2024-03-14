import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp, RouteProp } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StackNavigationProp } from "@react-navigation/stack";
import { Platform } from "react-native";

import Actor from "../screens/Actor/Actor";
import { Collection } from "../screens/Collection/Collection";
import Countdown from "../screens/Countdown/Countdown";
import Movie from "../screens/Movie/Movie";
import MovieDiscover from "../screens/MovieDiscover/MovieDiscover";

import { CountdownStackParamList, TabNavigationParamList } from "@/types";

type CountdownStackNavProp = CompositeNavigationProp<
  StackNavigationProp<CountdownStackParamList, "Countdown">,
  BottomTabNavigationProp<TabNavigationParamList>
>;

interface Props {
  navigation: CountdownStackNavProp;
  route: RouteProp<TabNavigationParamList, "CountdownTab">;
}

const Stack = createNativeStackNavigator();
export function CountdownStack({ navigation, route }: Props) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Countdown"
        component={Countdown}
        options={{
          headerTransparent: Platform.OS === "ios",
          headerBlurEffect: "dark",
        }}
      />
      <Stack.Screen
        name="Movie"
        component={Movie}
        options={({ route }) => ({
          headerTransparent: Platform.OS === "ios",
          headerBlurEffect: "dark",
          title: route.params.movieTitle,
        })}
      />
      <Stack.Screen
        name="MovieDiscover"
        component={MovieDiscover}
        options={{
          headerTransparent: Platform.OS === "ios",
          headerBlurEffect: "regular",
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
