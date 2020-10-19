import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { Navigation } from "../../types";
import Welcome from '../../authentication/Welcome';
import CreateAccount from '../../authentication/CreateAccount';
import Login from '../../authentication/Login';
import PasswordReset from '../../authentication/PasswordReset';

const AuthStack = createStackNavigator<Navigation.AuthStackParamList>();

export function AuthStackScreen() {
  return <AuthStack.Navigator>
    <AuthStack.Screen name="Welcome" component={Welcome} />
    <AuthStack.Screen name="Create Account" component={CreateAccount} />
    <AuthStack.Screen name="Sign In" component={Login} />
    <AuthStack.Screen name="Password Reset" component={PasswordReset} />
  </AuthStack.Navigator>
}
