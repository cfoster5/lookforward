/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useState } from 'react';
import {
  SafeAreaView,
  Button,
} from 'react-native';
import { Input } from 'react-native-elements';
import auth from '@react-native-firebase/auth';

function CreateAccount() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function createAccount() {
    try {
      await auth().createUserWithEmailAndPassword(username, password);
      console.log('User account created & signed in!');
    }
    catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');
      }
      if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
      }
      console.error(error);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Input
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Create Account" onPress={() => createAccount()} />
    </SafeAreaView>
  );
};

export default CreateAccount;
