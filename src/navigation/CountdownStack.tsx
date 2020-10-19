import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import Countdown from '../../Countdown';

const CountdownStack = createStackNavigator<any>();

export function CountdownStackScreen({ route, navigation }: any) {
  return <CountdownStack.Navigator>
    <CountdownStack.Screen
      name="Countdown"
      component={Countdown}
      initialParams={{
        // user: route.params.user
        uid: route.params.uid
      }}
    />
  </CountdownStack.Navigator>
}
