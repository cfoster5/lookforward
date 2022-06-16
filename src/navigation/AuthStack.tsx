import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CreateAccount from "../screens/Auth/CreateAccount";
import Login from "../screens/Auth/Login";
import PasswordReset from "../screens/Auth/PasswordReset";
import Welcome from "../screens/Auth/Welcome/Welcome";

export type AuthStackParamList = {
  Welcome: undefined;
  "Create Account": undefined;
  "Sign In": { emailSent?: boolean; email?: string };
  "Password Reset": undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();
export function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Welcome"
        component={Welcome}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Create Account" component={CreateAccount} />
      <Stack.Screen name="Sign In" component={Login} />
      <Stack.Screen name="Password Reset" component={PasswordReset} />
    </Stack.Navigator>
  );
}
