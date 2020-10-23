import React, { useEffect, useState } from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import Actor from "../../Actor";
import Details from "../screens/Details";
import Search from "../screens/Search";
import { Navigation } from "../../types";
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { onResult } from '../../helpers/helpers';

const HomeStack = createStackNavigator<Navigation.HomeStackParamList>();
export function HomeStackScreen({ route }: any) {
  const [countdownMovies, setCountdownMovies] = useState([]);
  const [countdownGames, setCountdownGames] = useState([]);

  useEffect(() => {
    const movieSubscription = firestore().collection('users').doc(route.params.uid).collection('items').orderBy("release_date").where("mediaType", "==", "movie")
      .onSnapshot(querySnapshot => { setCountdownMovies(onResult(querySnapshot, "movies")) }, (error) => console.error("error", error));

    const gameSubscription = firestore().collection("users").doc(route.params.uid).collection('items').orderBy("date").where("mediaType", "==", "game")
      // firestore().collection("games").orderBy("date").where("owner", "==", user.uid)
      .onSnapshot(querySnapshot => { setCountdownGames(onResult(querySnapshot, "games")) }, (error) => console.error("error", error));

    // Stop listening for updates when no longer required
    return () => {
      // Unmounting
      movieSubscription();
      gameSubscription();
    };
  }, [route.params.uid]);

  // useEffect(() => {
  //   console.log('homeStack changed')
  // }, [countdownMovies, countdownMovies])

  return <HomeStack.Navigator>
    {/* {props => <HomeStack.Screen name="Find" component={Search} {...props} extraData={{}} />}
    {props => <HomeStack.Screen name="Details" component={Details} {...props} extraData={{}} />} */}

    {/* <HomeStack.Screen name="Find" component={Search} initialParams={{ uid: route.params.uid }} /> */}
    <HomeStack.Screen name="Find">
      {props => <Search {...props} countdownMovies={countdownMovies} countdownGames={countdownGames} />}
    </HomeStack.Screen>
    {/* <HomeStack.Screen name="Details" component={Details} initialParams={{ uid: route.params.uid }} /> */}
    <HomeStack.Screen name="Details" initialParams={{ uid: route.params.uid }}>
      {props => <Details {...props} countdownMovies={countdownMovies} countdownGames={countdownGames} />}
    </HomeStack.Screen>
    <HomeStack.Screen name="Actor" component={Actor} />
  </HomeStack.Navigator>
}
