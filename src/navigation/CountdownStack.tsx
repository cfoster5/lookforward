import React from 'react';
import { createStackNavigator, StackNavigationProp } from "@react-navigation/stack";
import Countdown from '../screens/Countdown';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { Navigation } from '../../types';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import Details from '../screens/Details';

type CountdownStackNavProp = CompositeNavigationProp<
  StackNavigationProp<Navigation.CountdownStackParamList, "Countdown">,
  BottomTabNavigationProp<Navigation.TabNavigationParamList>
>;

interface Props {
  navigation: CountdownStackNavProp,
  route: RouteProp<Navigation.TabNavigationParamList, "Countdown">,
  countdownMovies: any[],
  countdownGames: any[]
}

const Stack = createStackNavigator<any>();
export function CountdownStack({ navigation, route, countdownMovies, countdownGames }: Props) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Countdown" initialParams={{ uid: route.params.uid }}>
        {props => <Countdown {...props} countdownMovies={countdownMovies} countdownGames={countdownGames} />}
      </Stack.Screen>
      <Stack.Screen name="Details" initialParams={{ uid: route.params.uid, igdbCreds: route.params.igdbCreds }}>
        {props => <Details {...props} countdownMovies={countdownMovies} countdownGames={countdownGames} />}
      </Stack.Screen>
    </Stack.Navigator>
  )
}
