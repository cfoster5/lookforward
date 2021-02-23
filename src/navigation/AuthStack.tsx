import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { Navigation } from "../../types";
import Welcome from '../screens/Welcome';
import CreateAccount from '../screens/CreateAccount';
import Login from '../screens/Login';
import PasswordReset from '../screens/PasswordReset';

const Stack = createStackNavigator<Navigation.AuthStackParamList>();

export function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
      <Stack.Screen name="Create Account" component={CreateAccount} />
      <Stack.Screen name="Sign In" component={Login} />
      <Stack.Screen name="Password Reset" component={PasswordReset} />
    </Stack.Navigator>
  )
}
