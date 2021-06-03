import React, { useEffect } from 'react';
import { createStackNavigator, StackNavigationProp } from "@react-navigation/stack";
import Countdown from '../screens/Countdown';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { Navigation } from '../../types';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import Details from '../screens/Details';
import { ColorSchemeName } from 'react-native';

type CountdownStackNavProp = CompositeNavigationProp<
  StackNavigationProp<Navigation.CountdownStackParamList, "Countdown">,
  BottomTabNavigationProp<Navigation.TabNavigationParamList>
>;

interface Props {
  navigation: CountdownStackNavProp,
  route: RouteProp<Navigation.TabNavigationParamList, "Countdown">,
  countdownMovies: any[],
  countdownGames: any[],
  // showSubs: any[],
  nextEpisodes: any[],
  colorScheme: ColorSchemeName
}

const Stack = createStackNavigator<any>();
export function CountdownStack({ navigation, route, countdownMovies, countdownGames, nextEpisodes, colorScheme }: Props) {

  useEffect(() => {
    console.log(`nextEpisodes from CountdownStack`, nextEpisodes)
  }, [nextEpisodes])

  return (
    <Stack.Navigator>
      <Stack.Screen name="Countdown" initialParams={{ uid: route.params.uid }}>
        {props => <Countdown {...props} countdownMovies={countdownMovies} countdownGames={countdownGames} nextEpisodes={nextEpisodes} />}
      </Stack.Screen>
      <Stack.Screen name="Details" initialParams={{ uid: route.params.uid }}>
        {props => <Details {...props} countdownMovies={countdownMovies} countdownGames={countdownGames} colorScheme={colorScheme} />}
      </Stack.Screen>
    </Stack.Navigator>
  )
}
