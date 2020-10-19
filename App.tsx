import React, { useState, useEffect } from 'react';
import { View, StatusBar, Appearance } from 'react-native';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import Search from './Search';
import Details from './Details';
import { Navigation } from './types';
import Actor from './Actor';
import { OverflowMenuProvider } from 'react-navigation-header-buttons';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import Countdown from './Countdown';
import Profile from './Profile';
import { AuthStackScreen } from './src/navigation/AuthStack';
import { TabNavigation } from './src/navigation/TabNavigator';

export default function App() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User>();
  // const [countdownMovies, setCountdownMovies] = useState([]);
  // const [countdownGames, setCountdownGames] = useState([]);

  // function onResult(querySnapshot: FirebaseFirestoreTypes.QuerySnapshot, mediaType: "movies" | "games") {
  //   // console.log(querySnapshot.docs);
  //   let tempMedia: any = []
  //   querySnapshot.docs.forEach(doc => {
  //     // console.log(doc.data())
  //     let data = doc.data();
  //     data.documentID = doc.id;
  //     tempMedia.push(data);
  //   });
  //   // State change here is forcing user back to home page on addToList();
  //   mediaType === "movies" ? setCountdownMovies(tempMedia) : setCountdownGames(tempMedia);
  // }

  // function onError(error: any) {
  //   console.error("error", error);
  // }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user) => {
      if (user) {
        // Signed in
        setUser(user);
        if (initializing) setInitializing(false);
      } else {
        // Signed out
        setUser(undefined);
        if (initializing) setInitializing(false);
      }
    });
    return subscriber; // unsubscribe on unmount
  }, []);

  // useEffect(() => {
  //   if (user) {
  //     const movieSubscription = firestore().collection('users').doc(user?.uid).collection('items').orderBy("release_date").where("mediaType", "==", "movie")
  //       .onSnapshot(querySnapshot => { onResult(querySnapshot, "movies") }, onError);

  //     const gameSubscription = firestore().collection("users").doc(user?.uid).collection('items').orderBy("date").where("mediaType", "==", "game")
  //       // firestore().collection("games").orderBy("date").where("owner", "==", user.uid)
  //       .onSnapshot(querySnapshot => { onResult(querySnapshot, "games") }, onError);

  //     // Stop listening for updates when no longer required
  //     return () => {
  //       // Unmounting
  //       movieSubscription();
  //       gameSubscription();
  //     };
  //   }
  // }, [user]);

  const Stack = createStackNavigator<Navigation.StackParamList>();

  const colorScheme = Appearance.getColorScheme();

  if (initializing) {
    return <View />
  }
  return <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    <OverflowMenuProvider>
      <>
        <StatusBar barStyle={colorScheme === 'dark' ? "default" : "dark-content"} />
        <Stack.Navigator>
          {user ? <Stack.Screen name="Home" component={TabNavigation} initialParams={{ uid: user?.uid }} options={{ headerShown: false }} /> : <Stack.Screen name="Welcome" component={AuthStackScreen} options={{ headerShown: false }} />}
        </Stack.Navigator>
      </>
    </OverflowMenuProvider>
  </NavigationContainer>
}
