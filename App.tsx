import React, { useState, useEffect } from 'react';
import { View, StatusBar, Appearance, Alert, Image, Dimensions } from 'react-native';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { OverflowMenuProvider } from 'react-navigation-header-buttons';
import SplashScreen from 'react-native-splash-screen'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import { Navigation } from './types';
import { AuthStackScreen } from './src/navigation/AuthStack';
import { TabNavigation } from './src/navigation/TabNavigator';

const Stack = createStackNavigator<Navigation.StackParamList>();

export default function App() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User>();

  useEffect(() => {
    // monitorTimeConsumingTask().then(result => setInitializing(false))
    const subscriber = auth().onAuthStateChanged((user) => {
      if (user) {
        // Signed in
        setUser(user);
        if (initializing) { setInitializing(false); SplashScreen.hide(); }

        // const unsubscribe = messaging().onMessage(async remoteMessage => {
        //   Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
        // });
      } else {
        // Signed out
        setUser(undefined);
        if (initializing) { setInitializing(false); SplashScreen.hide(); }
      }
    });
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    if (user) {
      requestUserPermission();
    }
  }, [user])

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      firestore().collection("users").doc(user?.uid).collection('contentPreferences').doc("preferences").update({
        weekNotifications: true,
        dayNotifications: true
      })
        .then(() => {
          // console.log("Document successfully written!");
        })
        .catch(error => {
          // console.error("Error writing document: ", error);
        });
      messaging().getToken().then(token => {
        return saveTokenToDatabase(token);
      });
      // Listen to whether the token changes
      return messaging().onTokenRefresh(token => {
        saveTokenToDatabase(token);
      });
    }
  }

  async function saveTokenToDatabase(token: string) {
    // Add the token to the users datastore
    await firestore().collection("users").doc(user?.uid).set({ deviceToken: token })
  }

  async function monitorTimeConsumingTask() {
    return await performTimeConsumingTask();
  }

  async function performTimeConsumingTask() {
    return new Promise((resolve) =>
      setTimeout(
        () => { resolve('result') },
        2000
      )
    );
  }

  // const colorScheme = Appearance.getColorScheme();
  const colorScheme = "dark";

  if (initializing) {
    return <View />
    // return <Image
    //   source={require("./src/assets/splash.png")}
    //   style={{ height: Dimensions.get("window").height, width: Dimensions.get("window").width }}
    // />
  }
  return <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    <OverflowMenuProvider>
      <>
        <StatusBar barStyle={colorScheme === 'dark' ? "light-content" : "dark-content"} />
        <Stack.Navigator>
          {user ? <Stack.Screen name="Home" component={TabNavigation} initialParams={{ uid: user?.uid }} options={{ headerShown: false }} /> : <Stack.Screen name="Welcome" component={AuthStackScreen} options={{ headerShown: false }} />}
        </Stack.Navigator>
      </>
    </OverflowMenuProvider>
  </NavigationContainer>
}
