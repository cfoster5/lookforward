import React, { useEffect, useState } from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { TabNavigation } from './TabNavigator';
import { HomeStackScreen } from './HomeStack';
import { Navigation } from '../../types';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

const Stack = createStackNavigator<Navigation.StackParamList>();

export function StackNavigator({ user }: { user: FirebaseAuthTypes.User | undefined }) {
  return <Stack.Navigator>
    {user ? <Stack.Screen
      name="Home"
      component={TabNavigation}
      options={{ headerShown: false }}
      initialParams={{ user: user }}
    /> :
      <Stack.Screen
        name="Welcome"
        component={HomeStackScreen}
        options={{ headerShown: false }}
      />}
  </Stack.Navigator>
}
