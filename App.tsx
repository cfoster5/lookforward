import React, { useState, useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { OverflowMenuProvider } from 'react-navigation-header-buttons';
import SplashScreen from 'react-native-splash-screen'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import { TabStack } from './src/navigation/TabStack';
import { AuthStack } from './src/navigation/AuthStack';
import ThemeContext from './src/contexts/ThemeContext';
import UserContext from './src/contexts/UserContext';
import { finishTransactionAsync, IAPResponseCode, setPurchaseListener } from 'expo-in-app-purchases';

export default function App() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User>();
  const [colorScheme, setColorScheme] = useState("dark");

  useEffect(() => {
    // monitorTimeConsumingTask().then(result => setInitializing(false))
    const subscriber = auth().onAuthStateChanged(user => {
      setUser(user ? user : undefined)
    });
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    if (user) {
      requestUserPermission();
      setInitializing(false);
    }
    else {
      setInitializing(false);
    }
  }, [user])

  useEffect(() => {
    if (!initializing) {
      SplashScreen.hide();
    }
  }, [initializing])

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      firestore().collection("users").doc(user?.uid).collection('contentPreferences').doc("preferences").set({
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

  setPurchaseListener(({ responseCode, results, errorCode }) => {
    // Purchase was successful
    if (responseCode === IAPResponseCode.OK) {
      results?.forEach(purchase => {
        if (!purchase.acknowledged) {
          console.log(`Successfully purchased ${purchase.productId}`);
          // Process transaction here and unlock content...
          // Then when you're done
          finishTransactionAsync(purchase, true);
        }
      });
    } else if (responseCode === IAPResponseCode.USER_CANCELED) {
      console.log('User canceled the transaction');
    } else if (responseCode === IAPResponseCode.DEFERRED) {
      console.log('User does not have permissions to buy but requested parental approval (iOS only)');
    } else {
      console.warn(`Something went wrong with the purchase. Received errorCode ${errorCode}`);
    }
  });

  if (initializing) {
    return <View />
  }
  return (
    <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar barStyle={colorScheme === 'dark' ? "light-content" : "dark-content"} />
      <OverflowMenuProvider>
        {user
          ?
          <ThemeContext.Provider value={colorScheme}>
            <UserContext.Provider value={user.uid}>
              <TabStack />
            </UserContext.Provider>
          </ThemeContext.Provider>
          :
          <AuthStack />
        }
      </OverflowMenuProvider>
    </NavigationContainer>
  )
}
