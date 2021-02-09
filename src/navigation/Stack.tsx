import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { TabNavigation } from './TabNavigator';
import { Navigation } from '../../types';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { AuthStackScreen } from './AuthStack';

const Stack = createStackNavigator<Navigation.RootStackParamList>();

export function StackNavigator({ user, igdbCreds }: { user: FirebaseAuthTypes.User | undefined, igdbCreds: any }) {
  return <Stack.Navigator>
    {user ? <Stack.Screen
      name="Tabs"
      component={TabNavigation}
      initialParams={{ uid: user.uid, igdbCreds: igdbCreds }}
      options={{ headerShown: false }}
    /> :
      <Stack.Screen
        name="Welcome"
        component={AuthStackScreen}
        options={{ headerShown: false }}
      />}
  </Stack.Navigator>
}
