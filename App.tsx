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
import ThemeContext from './src/ThemeContext';
import UserContext from './src/UserContext';

export default function App() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User>();
  const [igdbCreds, setIgdbCreds] = useState<any>(null);
  const [colorScheme, setColorScheme] = useState("dark")

  useEffect(() => {
    // monitorTimeConsumingTask().then(result => setInitializing(false))
    const subscriber = auth().onAuthStateChanged((user) => {
      if (user) {
        // Signed in
        setUser(user);
        if (initializing) {
          firestore().collection('igdbAuth').doc("creds").get().then(creds => {
            setIgdbCreds(creds.data())
          });
        }

        // const unsubscribe = messaging().onMessage(async remoteMessage => {
        //   Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
        // });
      } else {
        // Signed out
        setUser(undefined);
        if (initializing) {
          firestore().collection('igdbAuth').doc("creds").get().then(creds => {
            setIgdbCreds(creds.data())
          });
          setInitializing(false);
          // SplashScreen.hide();
        }
      }
    });
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    if (user) {
      requestUserPermission();
    }
  }, [user])

  useEffect(() => {
    if (igdbCreds) {
      console.log(igdbCreds)
      setInitializing(false);
    }
  }, [igdbCreds])

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

  if (initializing) {
    return <View />
    // return <Image
    //   source={require("./src/assets/splash.png")}
    //   style={{ height: Dimensions.get("window").height, width: Dimensions.get("window").width }}
    // />
  }
  return (
    <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <OverflowMenuProvider>
        <>
          <StatusBar barStyle={colorScheme === 'dark' ? "light-content" : "dark-content"} />
          {user
            ?
            <ThemeContext.Provider value={colorScheme}>
              <UserContext.Provider value={user.uid}>
                <TabStack igdbCreds={igdbCreds} />
              </UserContext.Provider>
            </ThemeContext.Provider>
            : <AuthStack />
          }
        </>
      </OverflowMenuProvider>
    </NavigationContainer>
  )
}
