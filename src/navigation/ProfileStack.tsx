import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import Profile from '../../Profile';

const ProfileStack = createStackNavigator<any>();

export function ProfileStackScreen({ route }: any) {
  return <ProfileStack.Navigator>
    <ProfileStack.Screen name="Profile" component={Profile} initialParams={{ uid: route.params.uid }} />
  </ProfileStack.Navigator>
}
