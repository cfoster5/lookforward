import React, { useEffect } from 'react';
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
  // showSubs: any[],
  nextEpisodes: any[]
}

const Stack = createStackNavigator<any>();
export function CountdownStack({ navigation, route, nextEpisodes }: Props) {

  useEffect(() => {
    console.log(`nextEpisodes from CountdownStack`, nextEpisodes)
  }, [nextEpisodes])

  return (
    <Stack.Navigator>
      <Stack.Screen name="Countdown">
        {props => <Countdown {...props} nextEpisodes={nextEpisodes} />}
      </Stack.Screen>
      <Stack.Screen name="Details" component={Details} />
    </Stack.Navigator>
  )
}
