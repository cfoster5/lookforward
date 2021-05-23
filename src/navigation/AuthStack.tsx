import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import Welcome from '../screens/Welcome';
import CreateAccount from '../screens/CreateAccount';
import Login from '../screens/Login';
import PasswordReset from '../screens/PasswordReset';

type AuthStackParamList = {
  Welcome: undefined,
  "Create Account": undefined
  "Sign In": undefined
  "Password Reset": undefined
}

const Stack = createStackNavigator<AuthStackParamList>();
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
