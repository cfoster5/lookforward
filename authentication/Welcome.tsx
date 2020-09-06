/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import { SafeAreaView, View, Dimensions } from 'react-native';
import { Text, Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

function Welcome() {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginLeft: 15, marginRight: 15 }}>
      <Text h4>Create an account to add items to your countdown list.</Text>
      <Button title="Create Account" onPress={() => navigation.navigate('Create Account')} style={{ width: Dimensions.get("window").width - 50 }} />

      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text>Already have an account?</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Button buttonStyle={{ justifyContent: 'flex-start' }} title="Sign In" type="clear" onPress={() => navigation.navigate('Sign In')} />
        </View>
      </View>

    </SafeAreaView>
  );
};

export default Welcome;
